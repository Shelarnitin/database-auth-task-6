import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoute from "./routes/auth.js";
import verifyToken from "./middleware/verifyToken.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoute);

// Protected route example
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "✅ Access granted to protected route!", user: req.user });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
