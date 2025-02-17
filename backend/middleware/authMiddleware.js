const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Change in production

// ✅ Middleware to Verify JWT Token & Set `req.user`
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password"); // Fetch user from DB
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user; // Attach full user object to `req.user`
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ Role-Based Authorization Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Not authorized for this action" });
    }
    next();
  };
};

module.exports = { authMiddleware, authorize };
