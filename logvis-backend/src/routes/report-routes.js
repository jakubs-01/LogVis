/**
 * @fileoverview Express router for report-related endpoints
 * @module routes/report-routes
 */

const express = require("express");
const reportController = require("../controllers/report-controller");

/**
 * Express router instance for handling report routes
 * @type {import('express').Router}
 */
const router = express.Router();

/**
 * GET /fights
 * Route to retrieve fight data
 */
router.get("/fights", reportController.getFights);

/**
 * GET /actors
 * Route to retrieve actor data
 */
router.get("/actors", reportController.getActors);

/**
 * GET /damageevents
 * Route to retrieve damage event data
 */
router.get("/damageevents", reportController.getDamageEvents);

/**
 * GET /titleandauthor
 * Route to retrieve report title and author
 */
router.get("/titleandauthor", reportController.getTitleAndAuthor);

/**
 * GET /debuffevents
 * Route to retrieve debuff event data
 */
router.get("/debuffevents", reportController.getDebuffEvents);

/**
 * GET /closestevent
 * Route to retrieve closest event data
 */
router.get("/closestevent", reportController.getClosestEvent);

/**
 * GET /abilityvisibility
 * Route to retrieve ability visibility data
 */
router.get("/abilityvisibility", reportController.getAbilityVisibility);

module.exports = router;
