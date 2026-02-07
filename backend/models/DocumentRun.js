const mongoose = require("mongoose");

const DocumentRunSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    status: { type: String, enum: ["success", "error"], required: true },
    aiResult: { type: Object, default: null },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DocumentRun", DocumentRunSchema);
