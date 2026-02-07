const mongoose = require("mongoose");

const ComplianceDatasetSchema = new mongoose.Schema(
  {
    entities: { type: [Object], default: [] },
    transactions: { type: [Object], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ComplianceDataset", ComplianceDatasetSchema);
