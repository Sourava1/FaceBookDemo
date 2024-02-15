const express = require("express");
const router = express.Router();
const YourModel = require("../models/Post"); 

router.delete("/deleteAllData", async (req, res) => {
  try {
    const result = await YourModel.deleteMany({});
    res.json({ message: `${result.deletedCount} documents deleted.` });
  } catch (error) {
    console.error("Error deleting documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
