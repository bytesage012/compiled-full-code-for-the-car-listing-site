const express = require("express");
const router = express.Router();
const multer = require("multer");
const pool = require("../db");

// Image upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});
const upload = multer({ storage });

// Add car
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { make, model, year, price, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      "INSERT INTO cars (make, model, year, price, description, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [make, model, year, price, description, imagePath]
    );

    res.json({
      car: result.rows[0],
      message: "Car added successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add car" });
  }
});

// Get all cars
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cars ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

module.exports = router;
