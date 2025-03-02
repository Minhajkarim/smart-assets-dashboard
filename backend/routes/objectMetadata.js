const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const ObjectMetadata = require("../models/ObjectMetadata");


const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    
    const objectMetadata = await ObjectMetadata.find({approvedCount:{ $gt: 0 }});

    if (!objectMetadata) {
      throw new Error("Failed to fetch metadata");
    }

    res.json(objectMetadata);
  
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

module.exports = router;
