const mongoose = require("mongoose");

const ReconciliationDatasetSchema = new mongoose.Schema(
  {
    transactions: { type: [Object], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReconciliationDataset", ReconciliationDatasetSchema);
