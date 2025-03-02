const mongoose = require("mongoose");

const objectMetadata = new mongoose.Schema({
  label: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 }, 
  name: { type: String, required: true },
  approvedCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("ObjectMetadata", objectMetadata);



