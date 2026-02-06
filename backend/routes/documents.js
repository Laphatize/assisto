const express = require("express");
const router = express.Router();
const multer = require("multer");
const openai = require("../lib/openai");

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/documents/process
router.post("/process", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;
    const { text } = req.body;

    const content = text || (file ? file.buffer.toString("utf-8") : null);
    if (!content) {
      return res.status(400).json({ error: "No file or text provided" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a financial document processing AI. Extract structured data from the provided document.
Return a JSON object with:
- "document_type": the type of document (e.g., "Trade Confirmation", "Invoice", "Settlement Statement", "KYC Document", "Margin Call", "SWIFT Message")
- "fields": an array of objects, each with "field_name", "value", and "confidence" (0-100)
- "summary": a one-sentence summary of the document
- "flags": an array of any issues or anomalies detected (empty array if none)
Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: `Process this financial document:\n\n${content.substring(0, 8000)}`,
        },
      ],
      temperature: 0.1,
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    res.json(parsed);
  } catch (error) {
    console.error("Document processing error:", error);
    res.status(500).json({ error: "Failed to process document" });
  }
});

module.exports = router;
