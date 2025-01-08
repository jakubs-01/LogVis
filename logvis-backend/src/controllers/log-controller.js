const logService = require("../services/log-db-service");
const IpInfo = require("../models/ip-info"); // Import the model
const NodeCache = require("node-cache");
const { Long } = require("mongodb"); // Add this at the top with other requires
/**
 * Fetches all logs from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response containing array of log documents
 */

const cache = new NodeCache({
  stdTTL: 60 * 60 * 24, // 24 hours
  checkperiod: 60 * 60 * 24, // 24 hours
});

const allowedUsers = process.env.ALLOWED_USERS.split(",");

exports.getLogs = async (req, res) => {
  if (!req.session.userName || !allowedUsers.includes(req.session.userName)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const logs = await logService.getAllLogs();
  res.json(logs);
};

exports.getQueryLogs = async (req, res) => {
  if (!req.session.userName || !allowedUsers.includes(req.session.userName)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const logs = await logService.getAllQueryLogs();
  res.json(logs);
};

exports.getIpInfo = async (req, res) => {
  if (!req.session.userName || !allowedUsers.includes(req.session.userName)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const ip = req.query.ip;
  const cachedData = cache.get(ip);
  if (cachedData) {
    res.json(cachedData);
    return;
  }

  function ipToNumber(ip) {
    return Long.fromNumber(
      ip
        .split(".")
        .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
    );
  }
  if (!ip) {
    return res.status(400).json({ message: "IP address is required" });
  }
  const numericIp = ipToNumber(ip);
  try {
    const record = await IpInfo.findOne({
      start_ip: { $lte: numericIp },
      end_ip: { $gte: numericIp },
    });
    if (record) {
      cache.set(ip, { country: record.country });
      res.json({ country: record.country });
    } else {
      res.status(404).json({ message: "IP information not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing IP information" });
  }
};
