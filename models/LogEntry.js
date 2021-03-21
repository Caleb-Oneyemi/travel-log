const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const logEntrySchema = new Schema(
  {
    location: {
      type: String,
      required: true,
    },
    comments: String,
    image: String,
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    visitDate: {
      required: true,
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const LogEntry = model("LogEntry", logEntrySchema);

module.exports = LogEntry;
