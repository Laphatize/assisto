const express = require("express");
const router = express.Router();
const openai = require("../lib/openai");

// POST /api/reconciliation/analyze
router.post("/analyze", async (req, res) => {
  try {
    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: "transactions array required" });
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
      temperature: 0.1,
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    res.json(parsed);
  } catch (error) {
    console.error("Reconciliation error:", error);
    res.status(500).json({ error: "Failed to run reconciliation" });
  }
});

module.exports = router;
