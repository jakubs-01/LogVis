const mongoose = require("mongoose");

/**
 * Mongoose schema for logging queries
 * @typedef {Object} QueryLogSchema
 * @property {string} query - The query string
 * @property {number} duration - Time taken to execute the query in ms
 * @property {Date} timestamp - When the query was executed
 * @property {boolean} fromCache - Indicates if the result was fetched from cache
 */
const queryLogSchema = new mongoose.Schema({
  query: String,
  variables: Object,
  duration: Number,
  timestamp: { type: Date, default: Date.now },
  fromCache: Boolean,
});

/**
 * Mongoose model for storing query logs
 * @type {import('mongoose').Model<QueryLogSchema>}
 */
module.exports = mongoose.model("QueryLog", queryLogSchema);
