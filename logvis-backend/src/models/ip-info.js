const mongoose = require("mongoose");

const ipInfoSchema = new mongoose.Schema({
  ip_version: { type: Number, required: true },
  start_ip: { type: Number, required: true },
  end_ip: { type: Number, required: true },
  country: { type: String, required: true },
  city: { type: String },
});

const IpInfo = mongoose.model("ip_range", ipInfoSchema);

module.exports = IpInfo;
