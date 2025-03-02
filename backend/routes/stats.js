const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Videos = require("../models/Video");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "admin" });
    const approvedVideos = await Videos.countDocuments({ status: "Approved" });

    // Aggregation pipeline to count detected objects by label
    const detectedObjectsAggregation = await Videos.aggregate([
      { $match: { status: "Approved" } }, // Filter only approved videos
      { $unwind: "$detectedObjects" }, // Unwind detectedObjects array
      { 
        $group: { 
          _id: "$detectedObjects.label", 
          count: { $sum: 1 } // Count occurrences of each label
        } 
      },
      { $sort: { count: -1 } }
    ]);

    const totalKmsAggregation = await Videos.aggregate([
      // Uncomment next line if you want only approved videos:
      // { $match: { status: "Approved" } },
      {
        $group: {
          _id: null,
          totalKms: { $sum: "$total_kms" },
        },
      },
    ]);

    const totalKms = totalKmsAggregation.length > 0 ? totalKmsAggregation[0].totalKms : 0;

    // Convert aggregation result into an object { label1: count1, label2: count2, ... }
    const detectedObjectsCount = detectedObjectsAggregation.reduce((acc, obj) => {
      acc[obj._id] = obj.count;
      return acc;
    }, {});

    // Get total count of all detected objects
    const totalAssetsCountAggregation = await Videos.aggregate([
      { $match: { status: "Approved" } },
      { $unwind: "$detectedObjects" },
      { $count: "totalAssetsCount" } // Count all objects
    ]);

    const totalAssetsCount = totalAssetsCountAggregation.length > 0 
      ? totalAssetsCountAggregation[0].totalAssetsCount 
      : 0;

      // calculate cracks and holes count 
      const cracksCount = Object.keys(detectedObjectsCount)
      .filter((key) => key.toLowerCase().includes("crack"))
      .reduce((sum, key) => sum + detectedObjectsCount[key], 0);

    const holesCount = Object.keys(detectedObjectsCount)
      .filter((key) => key.toLowerCase().includes("hole"))
      .reduce((sum, key) => sum + detectedObjectsCount[key], 0);

    const response = {
      totalUsers: usersCount,
      activeAdmins: adminCount,
      reportsSubmitted: approvedVideos,
      totalAssetsCount, // Total assets count
      detectedObjectsCount, // Objects grouped by label
      cracksCount,
      holesCount,
      totalKms,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

module.exports = router;
