/**
 * @fileoverview Express router for log-related endpoints
 * @module routes/log-routes
 */

const express = require("express");
const logController = require("../controllers/log-controller");

/**
 * Express router instance for handling log routes
 * @type {import('express').Router}
 */
const router = express.Router();

/**
 * GET /logs
 * Route to retrieve logs
 */
router.get("/logs", logController.getLogs);
router.get("/querylogs", logController.getQueryLogs);
router.get("/ipinfo", logController.getIpInfo);
module.exports = router;
