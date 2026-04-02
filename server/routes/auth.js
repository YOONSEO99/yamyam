const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Running Auth Route" });
});

module.exports = router;
