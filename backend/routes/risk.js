const express = require("express");
const router = express.Router();
const openai = require("../lib/openai");

// POST /api/risk/analyze
router.post("/analyze", async (req, res) => {
  try {
    const { portfolio, scenarios } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a financial risk assessment AI. Analyze the provided portfolio and run stress tests.
Evaluate:
- Value at Risk (VaR) at 95% confidence
- Expected Shortfall (CVaR)
- Portfolio Sharpe ratio estimate
- Maximum drawdown assessment
- Exposure concentration risk
- Stress test each scenario provided

Return a JSON object with:
- "metrics": object with "var_95" (dollar string), "expected_shortfall" (dollar string), "sharpe_ratio" (number string), "max_drawdown" (percentage string)
- "exposures": array of objects with "asset", "exposure", "percentage", "risk_level" (Low/Medium/High)
- "stress_tests": array of objects with "scenario", "impact" (dollar string), "severity" (high/medium/low), "detail"
- "recommendations": array of risk mitigation suggestions
Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: `Analyze this portfolio:\n${JSON.stringify(portfolio || [])}\n\nStress scenarios:\n${JSON.stringify(scenarios || [])}`,
        },
      ],
      temperature: 0.1,
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    res.json(parsed);
  } catch (error) {
    console.error("Risk analysis error:", error);
    res.status(500).json({ error: "Failed to run risk analysis" });
  }
});

module.exports = router;
