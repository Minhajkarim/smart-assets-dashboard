const express = require("express");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Video = require("../models/Video");

const router = express.Router();

// ✅ Get Profile (Only Authenticated Users)
router.get("/", authMiddleware,authorize("admin", "superadmin"), async (req, res) => {
  try {
    const videos = await Video.find()
    if (!videos) return res.status(204).json({ error: "No Videos" });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:user_id", authMiddleware, async (req, res) => {
    try {
    const query = {uploadUserId: req.params.user_id};
    const limit = parseInt(req.query.limit) || 10;
    if (req.query.filters){
      const filters = JSON.parse(req.query.filters);
      if (filters.status){
        // create query
        query.status = filters.status;
      }
      
    }



    const videos = await Video.find(query, null, { limit:limit }).sort({ uploadedAt: -1 });
      if (!videos) return res.status(204).json({ error: "No Videos" });
  
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

// ✅ Update Video metadata i.e filename and status (Only the logged-in user)
router.put("/", authMiddleware, async (req, res) => {
    try {
        const { filename, status } = req.body;
        const updatedVideo = await Video.findByIdAndUpdate(
        req.user._id,
        { filename, status },
        { new: true, runValidators: true }
        ).select("-password");
    
        res.json({ message: "Video updated successfully", video: updatedVideo });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Admin-only Route Example
router.get(
  "/admin",
  authMiddleware,
  authorize("admin", "superadmin"),
  (req, res) => {
    res.json({ message: "Welcome, Admin!" });
  }
);

module.exports = router;
