import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 🧾 REGISTER USER
router.post("/register", async (req, res) => {
  try {
    console.log("📩 Registration request received:", req.body);

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "✅ User registered successfully",
      user: savedUser,
    });
    } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "⚠️ Username or Email already exists. Please try another.",
      });
    }
    res.status(500).json({ message: "Registration failed", error });
  }

});


// 🔑 LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("❌ User not found!");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("⚠️ Invalid password!");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({
      message: "✅ Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

export default router;
