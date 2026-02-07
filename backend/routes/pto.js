const express = require("express");
const router = express.Router();
const PTORequest = require("../models/PTORequest");
const { openai, hasOpenAI } = require("../lib/openai");

const VAPI_BASE = "https://api.vapi.ai";

// GET /api/pto — list all PTO requests
router.get("/", async (_req, res) => {
  try {
    const requests = await PTORequest.find().sort({ createdAt: -1 }).lean();
    res.json(requests);
  } catch (error) {
    console.error("PTO list error:", error);
    res.status(500).json({ error: "Failed to load PTO requests" });
  }
});

// GET /api/pto/stats — summary stats
router.get("/stats", async (_req, res) => {
  try {
    const all = await PTORequest.find().lean();
    const pending = all.filter((r) => r.status === "pending").length;
    const approved = all.filter((r) => r.status === "approved").length;
    const denied = all.filter((r) => r.status === "denied").length;
    const totalDaysUsed = all
      .filter((r) => r.status === "approved")
      .reduce((sum, r) => sum + (r.days || 0), 0);

    // Group by type
    const byType = {};
    all.filter((r) => r.status === "approved").forEach((r) => {
      byType[r.type] = (byType[r.type] || 0) + (r.days || 0);
    });

    res.json({ total: all.length, pending, approved, denied, totalDaysUsed, byType });
  } catch (error) {
    console.error("PTO stats error:", error);
    res.status(500).json({ error: "Failed to load PTO stats" });
  }
});

// POST /api/pto — create a new PTO request
router.post("/", async (req, res) => {
  try {
    const { employeeName, employeeEmail, type, startDate, endDate, days, reason } = req.body;
    if (!employeeName || !employeeEmail || !startDate || !endDate || !days) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const request = await PTORequest.create({
      employeeName,
      employeeEmail,
      type: type || "vacation",
      startDate,
      endDate,
      days,
      reason: reason || "",
    });
    res.json(request);
  } catch (error) {
    console.error("PTO create error:", error);
    res.status(500).json({ error: "Failed to create PTO request" });
  }
});

// PATCH /api/pto/:id — approve or deny
router.patch("/:id", async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    if (!["approved", "denied"].includes(status)) {
      return res.status(400).json({ error: "Status must be approved or denied" });
    }
    const request = await PTORequest.findByIdAndUpdate(
      req.params.id,
      { status, reviewNote: reviewNote || "" },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: "Request not found" });
    res.json(request);
  } catch (error) {
    console.error("PTO update error:", error);
    res.status(500).json({ error: "Failed to update PTO request" });
  }
});

// DELETE /api/pto/:id
router.delete("/:id", async (req, res) => {
  try {
    await PTORequest.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("PTO delete error:", error);
    res.status(500).json({ error: "Failed to delete PTO request" });
  }
});

// POST /api/pto/analyze — AI analysis of PTO patterns
router.post("/analyze", async (req, res) => {
  try {
    if (!hasOpenAI) {
      return res.status(500).json({ error: "No AI API key configured" });
    }

    const all = await PTORequest.find().sort({ createdAt: -1 }).lean();
    if (all.length === 0) {
      return res.json({ analysis: "No PTO data available to analyze yet. Submit some PTO requests first." });
    }

    const summary = all.map((r) =>
      `${r.employeeName} | ${r.type} | ${r.startDate?.toISOString?.()?.split("T")[0] || r.startDate} to ${r.endDate?.toISOString?.()?.split("T")[0] || r.endDate} | ${r.days} days | ${r.status}${r.reason ? ` | Reason: ${r.reason}` : ""}`
    ).join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an HR analytics assistant. Analyze PTO request data and provide insights about patterns, coverage risks, and recommendations. Be concise and actionable.",
        },
        {
          role: "user",
          content: `Analyze these PTO requests and provide insights:\n\n${summary}`,
        },
      ],
      temperature: 0.3,
    });

    res.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error("PTO analyze error:", error);
    res.status(500).json({ error: "Failed to analyze PTO data" });
  }
});

// POST /api/pto/sync-calls — poll Vapi for recent calls and create PTO requests
router.post("/sync-calls", async (req, res) => {
  try {
    if (!process.env.VAPI_API_KEY) {
      return res.status(500).json({ error: "VAPI_API_KEY not set" });
    }

    // Build query params for GET /call
    const params = new URLSearchParams({ limit: "50" });
    if (process.env.VAPI_ASSISTANT_ID) {
      params.set("assistantId", process.env.VAPI_ASSISTANT_ID);
    }

    const callsRes = await fetch(`${VAPI_BASE}/call?${params}`, {
      headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}` },
    });

    if (!callsRes.ok) {
      const errText = await callsRes.text();
      console.error("Vapi list calls failed:", callsRes.status, errText);
      return res.status(502).json({ error: "Vapi API error", status: callsRes.status, detail: errText });
    }

    const calls = await callsRes.json();
    console.log(`Vapi returned ${calls.length} calls`);

    // Get all callIds we've already processed
    const existingCallIds = new Set(
      (await PTORequest.find({ source: "phone", callId: { $ne: "" } }).select("callId").lean())
        .map((r) => r.callId)
    );

    const validTypes = ["vacation", "sick", "personal", "bereavement", "other"];
    let created = 0;
    let skipped = { already: 0, notEnded: 0, noData: 0, noAnalysis: 0 };

    for (const call of calls) {
      if (!call.id || existingCallIds.has(call.id)) { skipped.already++; continue; }
      if (call.status !== "ended") { skipped.notEnded++; continue; }

      // Fetch full call details (list endpoint doesn't include structured data)
      const fullCallRes = await fetch(`${VAPI_BASE}/call/${call.id}`, {
        headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}` },
      });
      if (!fullCallRes.ok) {
        console.log(`Call ${call.id}: failed to fetch details (${fullCallRes.status})`);
        skipped.noAnalysis++;
        continue;
      }
      const fullCall = await fullCallRes.json();

      // Structured outputs live at artifact.structuredOutputs[outputId].result
      const outputs = fullCall.artifact?.structuredOutputs;
      console.log(`Call ${call.id}: artifact.structuredOutputs =`, JSON.stringify(outputs));

      if (!outputs || typeof outputs !== "object") {
        console.log(`Call ${call.id}: no artifact.structuredOutputs — skipping`);
        skipped.noAnalysis++;
        continue;
      }

      // Find the PTO result from structured outputs
      let structuredData = null;
      for (const outputId of Object.keys(outputs)) {
        const entry = outputs[outputId];
        if (entry?.result && typeof entry.result === "object") {
          if (entry.name === "pto_requested" || !structuredData) {
            structuredData = entry.result;
          }
        }
      }

      if (!structuredData) {
        console.log(`Call ${call.id}: no valid structured result found:`, JSON.stringify(outputs));
        skipped.noAnalysis++;
        continue;
      }

      console.log(`Call ${call.id}: resolved structuredData =`, JSON.stringify(structuredData));

      // Map Vapi structured output fields (name, dateStart, dateEnd, category, reason)
      const empName = structuredData.name || structuredData.employee_name;
      const startStr = structuredData.dateStart || structuredData.start_date;
      const endStr = structuredData.dateEnd || structuredData.end_date;

      if (!empName || !startStr || !endStr) {
        console.log(`Call ${call.id}: missing required fields — name=${empName} start=${startStr} end=${endStr}`);
        skipped.noData++;
        continue;
      }

      const start = new Date(startStr);
      const end = new Date(endStr);
      if (isNaN(start) || isNaN(end)) {
        console.log(`Call ${call.id}: invalid dates — start=${startStr} end=${endStr}`);
        skipped.noData++;
        continue;
      }

      const days = structuredData.total_days || Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
      const ptoType = (structuredData.category || structuredData.pto_type || "other").toLowerCase();

      // Transcript from full call
      let transcript = fullCall.analysis?.summary || "";
      if (!transcript && Array.isArray(fullCall.transcript)) {
        transcript = fullCall.transcript
          .map((t) => `${t.role}: ${t.message}`)
          .join("\n");
      } else if (!transcript && typeof fullCall.transcript === "string") {
        transcript = fullCall.transcript;
      }

      await PTORequest.create({
        employeeName: empName,
        employeeEmail: structuredData.email || structuredData.employee_email || "",
        employeePhone: fullCall.customer?.number || structuredData.phone || "",
        source: "phone",
        callId: call.id,
        transcript,
        type: validTypes.includes(ptoType) ? ptoType : "other",
        startDate: start,
        endDate: end,
        days,
        reason: structuredData.reason === "null" ? "" : (structuredData.reason || ""),
      });

      created++;
      console.log(`PTO request created for ${empName} (call ${call.id})`);
    }

    console.log("Sync complete:", { created, skipped });
    res.json({ synced: created, total_calls: calls.length, skipped });
  } catch (error) {
    console.error("Vapi sync error:", error);
    res.status(500).json({ error: "Failed to sync Vapi calls", detail: error.message });
  }
});

module.exports = router;
