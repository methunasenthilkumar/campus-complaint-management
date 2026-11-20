require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/studentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((req, res) => res.status(404).json({ message: "API route not found" }));
app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(", ") });
  }
  if (error.code === 11000) return res.status(409).json({ message: "A record with these details already exists" });
  res.status(500).json({ message: "An unexpected server error occurred" });
});

const start = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

if (require.main === module) start();
module.exports = app;
