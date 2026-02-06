const express = require("express");
const router = express.Router();
const openai = require("../lib/openai");

// POST /api/compliance/scan
router.post("/scan", async (req, res) => {
  try {
    const { entities, transactions } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a financial compliance AI. Analyze the provided entities and transactions for regulatory compliance issues.
Check for:
- AML (Anti-Money Laundering) red flags
- KYC (Know Your Customer) issues
- OFAC sanctions screening concerns
- SOX (Sarbanes-Oxley) control violations
- Regulation W affiliate transaction limits
- Unusual transaction patterns

Return a JSON object with:
- "alerts": array of objects with "id" (generate CMP-xxx), "rule", "entity", "severity" (high/medium/low), "detail", "recommended_action"
- "regulatory_scores": array of objects with "regulation", "score" (0-100), "status" (Compliant/Action Required/Monitoring)
- "summary": brief overall compliance assessment
Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: `Scan these for compliance issues:\n\nEntities: ${JSON.stringify(entities || [])}\n\nTransactions: ${JSON.stringify(transactions || [])}`,
        },
      ],
      temperature: 0.1,
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    res.json(parsed);
  } catch (error) {
    console.error("Compliance scan error:", error);
    res.status(500).json({ error: "Failed to run compliance scan" });
  }
});

module.exports = router;
