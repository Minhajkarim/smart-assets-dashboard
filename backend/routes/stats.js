const express = require("express");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Videos = require("../models/Video");

const router = express.Router();


router.get("/",authMiddleware, async (req, res) => {
   
  
    try {
      const usersCount = await User.countDocuments();
  
      if (!usersCount) {
        return res.status(400).json({ error: "Failed counting users" });
      }
  
      
      const adminCount = await User.countDocuments({role: "admin"});

        if (!adminCount) {
            return res.status(400).json({ error: "Failed counting admins" });
        }

        const approvedVideos = await Videos.countDocuments({status: "Approved"});

        if (!approvedVideos) {
            return res.status(400).json({ error: "Failed counting approved videos" });
        }
        const response = {
        "totalUsers": usersCount,
        "activeAdmins": adminCount,
        "reportsSubmitted": approvedVideos,
        }

        console.log("response", response);
      
      res.status(200).json(response);
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });


module.exports = router;
