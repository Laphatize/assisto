const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/users/sync
// Upsert user data from Firebase on login
router.post("/sync", async (req, res) => {
  try {
    const { firebaseUid, email, displayName, photoURL } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ error: "firebaseUid and email are required" });
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { email, displayName, photoURL },
      { upsert: true, new: true, runValidators: true }
    );

    res.json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/users/:firebaseUid
// Fetch a user by Firebase UID
router.get("/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
