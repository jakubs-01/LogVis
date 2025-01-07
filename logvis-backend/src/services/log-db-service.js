const mongoose = require("mongoose");
const Log = require("../models/log");
const QueryLog = require("../models/querylog");
/**
 * Fetches all logs from MongoDB database
 * @returns {Promise<Array>} Array of log documents
 */
exports.getAllLogs = async () => {
  try {
    const logs = await Log.find({});
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};

exports.getAllQueryLogs = async () => {
  try {
    const logs = await QueryLog.find({});
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};
