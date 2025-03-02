const express = require("express");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// ✅ Get Profile (Only Authenticated Users)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default 10 users per page
          const page = parseInt(req.query.page) || 1; // Default page 1
          const skip = (page - 1) * limit; // Calculate skip value
      
          // Get total user count
          const totalUsers = await User.countDocuments({role: "user"});
          const totalPages = Math.ceil(totalUsers / limit);
      
          // Fetch users with pagination, excluding passwords
          console.log(req.user.role);
          let users;
          if (req.user.role === "admin"){
            users = await User.find({role:"user"}, "-password").skip(skip).limit(limit);

          }else if (req.user.role === "superadmin"){
            // find users and admins but not superadmins
            users = await User.find({role:{$ne:"superadmin"}}, "-password").skip(skip).limit(limit);
          }
          console.log(users);
    
          
    
          if (!users) return res.status(204).json({ error: "No Users" });
      
          res.status(200).json({
            users,
            totalUsers,
            totalPages,
            currentPage: page,
            perPage: limit,
          });
        } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).json({ error: "Failed to fetch users" });
        }
      });

// ✅ Update Single User (PUT /users/:user_id)
router.put("/:user_id",authMiddleware, async (req, res) => {
  const { user_id } = req.params;
  const { name, email, role,approved } = req.body; // Allow updating only specific fields

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { name, email, role, approved }, // Only update these fields
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ✅ Delete Single User (DELETE /users/:user_id)
router.delete("/:user_id",authMiddleware, async (req, res) => {
  const { user_id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(user_id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.get("/userCount",authMiddleware, async (req, res) => {
   
  
    try {
      const usersCount = await User.countDocuments();
  
      if (!usersCount) {
        return res.status(400).json({ error: "Failed counting users" });
      }
  
      res.status(200).json({ usersCount });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });


router.get("/admin",authMiddleware, async (req, res) => {
  

  try {
    const admins = await User.find({role: "admin"});  
    if (!admins) {
      return res.status(400).json({ error: "Failed fetching admins" });
    }
    res.status(200).json(admins );

    
  }
  catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Failed to fetch admins" });
  }

});

module.exports = router;
