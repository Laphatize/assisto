const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    storagePath: { type: String, required: true },
    extractedText: { type: String, default: "" },
    aiResult: { type: Object, default: null },
    status: { type: String, enum: ["uploaded", "processed", "error"], default: "uploaded" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
