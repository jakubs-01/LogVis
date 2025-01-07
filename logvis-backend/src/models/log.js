const mongoose = require("mongoose");

/**
 * Mongoose schema for logging HTTP requests and responses
 * @typedef {Object} LogSchema
 * @property {Object} request - Details about the HTTP request
 * @property {string} request.method - HTTP method used (GET, POST, etc)
 * @property {string} request.url - Request URL path
 * @property {Object} request.headers - HTTP request headers
 * @property {Object} request.body - HTTP request body
 * @property {Date} request.timestamp - When the request was received
 * @property {string} request.ip - IP address of the requester
 * @property {Object} response - Details about the HTTP response
 * @property {number} response.statusCode - HTTP status code returned
 * @property {number} response.duration - Time taken to process request in ms
 * @property {Object} response.firstDataPiece - Sample of response data
 */
const logSchema = new mongoose.Schema({
  request: {
    method: String,
    url: String,
    headers: Object,
    body: Object,
    timestamp: Date,
    ip: String,
  },
  response: {
    statusCode: Number,
  },
});

/**
 * Mongoose model for storing HTTP request/response logs
 * @type {import('mongoose').Model<LogSchema>}
 */
module.exports = mongoose.model("log", logSchema);
