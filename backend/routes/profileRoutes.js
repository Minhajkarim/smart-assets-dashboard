const express = require("express");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// ✅ Get Profile (Only Authenticated Users)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update Profile (Only the logged-in user)
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
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
