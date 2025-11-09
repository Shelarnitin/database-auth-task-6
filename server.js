const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoute = require("./routes/auth");
const verifyToken = require("./middleware/verifyToken");

dotenv.config();
const app = express();

// Middleware
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
