const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploads (images, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
const carRoutes = require("./routes/cars");
app.use("/api/cars", carRoutes);

// ✅ Serve React build in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "build");
  app.use(express.static(buildPath));

  // Catch-all route for React Router
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

