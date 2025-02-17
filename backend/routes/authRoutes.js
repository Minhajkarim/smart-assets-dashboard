const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Change in production

// User Signup Route
router.post(
  "/signup",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ error: "User already exists" });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save user
      user = new User({
        name,
        email,
        password: hashedPassword,
        role: role,
      });
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(201).json({ token, user: { name, email, role } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// User Signin Route
router.post("/signin", async (req, res) => {
  console.log("req.body: ", req.body);
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const resData = {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      role: user.role,
    };

    console.log("resData: ", resData);
    res.json(resData);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
