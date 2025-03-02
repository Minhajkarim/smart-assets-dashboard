const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  uploadPath: { type: String, required: true },
  processedPath: { type: String, required: false },
  status: {
    type: String,
    enum: ["uploaded", "processing", "processed", "processing_failed", "Resurvey", "Approved", "Pending"],
    default: "uploaded",
  },
  uploadedAt: { type: Date, default: Date.now },
  lastModifiedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  detectedObjects: [
    {
      id: { type: String },
      label: { type: String, required: true },
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      image_path: { type: String, default: "" },
    },
  ],
  total_kms: {
    type: Number,
    required: false,
    default: 0.0,
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: ["uploaded", "processing", "processed", "processing_failed", "Resurvey", "Approved", "Pending"],
      },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  processingError: { type: String },
  uploadUserId: {
    type: String,
    required: true,
  },

  resurveryComments:{ 
    type: Array,
    required: true,
    default: []},
});

videoSchema.virtual("processingDuration").get(function () {
  if (this.processedAt && this.uploadedAt) {
    return Math.floor((this.processedAt - this.uploadedAt) / 1000); // Duration in seconds
  }
  return null;
});

videoSchema.index({ status: 1 });
videoSchema.index({ uploadedAt: -1 });

module.exports = mongoose.model("Video", videoSchema);
