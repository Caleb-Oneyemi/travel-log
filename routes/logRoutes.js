const express = require("express");
const LogEntry = require("../models/LogEntry");

const router = express.Router();

router.get('/logs', async (req, res, next) => {
  try {
    const entries = await LogEntry.find();
    res.json(entries);
  } catch (err) {
    next(err);
  }
});

router.post('/logs', async (req, res, next) => {
  try {
    const logEntry = new LogEntry(req.body);
    const newEntry = await logEntry.save();

    res.json(newEntry);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(422);
    }
    next(err);
  }
});

module.exports = router;
