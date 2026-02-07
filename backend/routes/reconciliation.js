const express = require("express");
const router = express.Router();
const { openai, hasOpenAI } = require("../lib/openai");
const ReconciliationDataset = require("../models/ReconciliationDataset");
const ReconciliationRun = require("../models/ReconciliationRun");
const Report = require("../models/Report");
const ReconciliationResolution = require("../models/ReconciliationResolution");

async function getOrCreateDataset() {
  let dataset = await ReconciliationDataset.findOne();
  if (!dataset) dataset = await ReconciliationDataset.create({ transactions: [] });
  return dataset;
}

// GET /api/reconciliation/dataset
router.get("/dataset", async (_req, res) => {
  const dataset = await getOrCreateDataset();
  res.json(dataset);
});

// PUT /api/reconciliation/dataset
router.put("/dataset", async (req, res) => {
  const { transactions } = req.body;
  if (!Array.isArray(transactions)) {
    return res.status(400).json({ error: "transactions array required" });
  }
  const dataset = await getOrCreateDataset();
  dataset.transactions = transactions;
  await dataset.save();
  res.json(dataset);
});

// GET /api/reconciliation/runs
router.get("/runs", async (_req, res) => {
  const runs = await ReconciliationRun.find().sort({ createdAt: -1 }).lean();
  res.json(runs);
});

// GET /api/reconciliation/resolutions
router.get("/resolutions", async (_req, res) => {
  const resolutions = await ReconciliationResolution.find().sort({ updatedAt: -1 }).lean();
  res.json(resolutions);
});

// POST /api/reconciliation/resolutions
router.post("/resolutions", async (req, res) => {
  const { transactionId, status, matched_with, notes } = req.body || {};
  if (!transactionId || !status) {
    return res.status(400).json({ error: "transactionId and status required" });
  }
  const update = {
    $set: {
      transactionId,
      status,
      matched_with: matched_with || null,
      notes: notes || "",
    },
    $push: { history: { status, matched_with: matched_with || null, notes: notes || "" } },
  };
  const resolution = await ReconciliationResolution.findOneAndUpdate(
    { transactionId },
    update,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json(resolution);
});

// POST /api/reconciliation/analyze
router.post("/analyze", async (req, res) => {
  try {
    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: "transactions array required" });
    }

    if (!hasOpenAI) {
      return res.status(500).json({ error: "OPENAI_API_KEY not set" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a financial reconciliation AI. Analyze the provided transactions and perform matching/reconciliation.
For each transaction, determine:
- Whether it matches with another transaction (matched, exception, or pending)
- If exception: explain why (amount mismatch, missing counterparty record, date discrepancy, etc.)
- Suggest resolution actions for exceptions

Return a JSON object with:
- "results": array of objects with "id", "status" (matched/exception/pending), "matched_with" (id or null), "notes"
- "summary": object with "total", "matched", "exceptions", "pending"
- "recommendations": array of suggested actions to resolve exceptions
Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: `Reconcile these transactions:\n${JSON.stringify(transactions, null, 2)}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const parsed = JSON.parse(response.choices[0].message.content);

    const dataset = await getOrCreateDataset();
    dataset.transactions = transactions;
    await dataset.save();

    const run = await ReconciliationRun.create({
      datasetId: dataset._id,
      transactions,
      results: parsed.results || [],
      summary: parsed.summary || null,
      recommendations: parsed.recommendations || [],
      status: "success",
    });

    await Report.create({
      type: "reconciliation",
      title: "Reconciliation Report",
      summary: parsed.summary
        ? `${parsed.summary.matched || 0}/${parsed.summary.total || 0} matched`
        : "Reconciliation run summary",
      payload: run,
      status: "success",
    });

    res.json({ ...parsed, runId: run._id });
  } catch (error) {
    console.error("Reconciliation error:", error);
    await ReconciliationRun.create({
      transactions: req.body?.transactions || [],
      status: "error",
      error: error.message,
    });
    await Report.create({
      type: "reconciliation",
      title: "Reconciliation Report (Error)",
      summary: error.message,
      payload: { transactions: req.body?.transactions || [] },
      status: "error",
    });
    res.status(error.status || 500).json({ error: error.message || "Failed to run reconciliation" });
  }
});

module.exports = router;
