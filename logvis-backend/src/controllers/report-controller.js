const WarcraftLogsAPIInstance = require("../services/api-service");
const dataService = require("../services/data-service");
const createBossInstance = require("../models/boss-factory");
/**
 * Fetches and filters fight data for a given report
 * @param {Object} req - Express request object containing reportCode in query
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with filtered fight data or error
 */
exports.getFights = async (req, res) => {
  const { reportCode } = req.query;

  try {
    const fights = await WarcraftLogsAPIInstance.fetchFights(
      reportCode,
      req.session.access_token
    );
    const filteredFights = await dataService.extractFights(fights);
    res.json(filteredFights);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Fetches and filters actor data for a given report
 * @param {Object} req - Express request object containing reportCode in query
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with filtered actor data or error
 */
exports.getActors = async (req, res) => {
  const { reportCode } = req.query;

  try {
    const actors = await WarcraftLogsAPIInstance.fetchActors(
      reportCode,
      req.session.access_token
    );
    const filterActors = await dataService.extractActors(actors);
    res.json(filterActors);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Fetches and processes damage events for a given boss fight
 * @param {Object} req - Express request object containing reportCode, bossName and fightIDs in query
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with mapped damage events or error
 */
exports.getDamageEvents = async (req, res) => {
  //const { reportCode, spellId, fightIDs } = req.query;
  const { reportCode, bossName, fightIDs } = req.query;
  let boss;
  try {
    boss = createBossInstance(bossName);
  } catch (error) {
    console.error(error.message);
    res
      .status(501)
      .json({ message: `${bossName} does not have a supported module` });
    return;
  }
  try {
    if (!boss.abilities || boss.abilities.length === 0) {
      return res.json([]); // Return empty array if no debuffs to query
    }
    const results = await Promise.all(
      boss.abilities.map(async (abilityId) => {
        try {
          const events = await WarcraftLogsAPIInstance.fetchDamageEvents(
            reportCode,
            abilityId,
            fightIDs,
            req.session.access_token
          );
          return events || [];
        } catch (error) {
          console.error(
            `Error fetching events for abilityId ${abilityId}: ${error.message}`
          );
          return []; // Return an empty array on error to avoid breaking the loop
        }
      })
    );

    // Flatten the results
    const combinedData = results.flat(); // Flattens the array of arrays

    const actors = await WarcraftLogsAPIInstance.fetchActors(
      reportCode,
      req.session.access_token
    );
    const filterActors = await dataService.extractActors(actors);
    const fightStartTime = await WarcraftLogsAPIInstance.fetchFightStartTime(
      reportCode,
      fightIDs,
      req.session.access_token
    );
    const extractedFightStartTime = await dataService.extractFightStartTime(
      fightStartTime
    );
    const mappedEvents = await dataService.extractMappedDamageEvents(
      combinedData,
      actors,
      extractedFightStartTime,
      reportCode,
      boss.regions,
      req.session.access_token
    );
    res.json(mappedEvents);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Fetches and processes debuff events for a given boss fight
 * @param {Object} req - Express request object containing reportCode, bossName and fightIDs in query
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with mapped debuff events or error
 */
exports.getDebuffEvents = async (req, res) => {
  //const { reportCode, spellId, fightIDs } = req.query;
  const { reportCode, bossName, fightIDs } = req.query;
  let boss;
  try {
    boss = createBossInstance(bossName);
  } catch (error) {
    console.error(error.message);
    res
      .status(501)
      .json({ message: `${bossName} does not have a supported module` });
    return;
  }

  try {
    if (!boss.debuffs || boss.debuffs.length === 0) {
      return res.json([]); // Return empty array if no debuffs to query
    }

    const results = await Promise.all(
      boss.debuffs.map(async (abilityId) => {
        try {
          const events = await WarcraftLogsAPIInstance.fetchDebuffEvents(
            reportCode,
            abilityId,
            fightIDs,
            req.session.access_token
          );
          return events || [];
        } catch (error) {
          console.error(
            `Error fetching events for abilityId ${abilityId}: ${error.message}`
          );
          return []; // Return an empty array on error to avoid breaking the loop
        }
      })
    );

    // Flatten the results
    const combinedData = results.flat(); // Flattens the array of arrays

    const actors = await WarcraftLogsAPIInstance.fetchActors(
      reportCode,
      req.session.access_token
    );
    const filterActors = await dataService.extractActors(actors);
    const fightStartTime = await WarcraftLogsAPIInstance.fetchFightStartTime(
      reportCode,
      fightIDs,
      req.session.access_token
    );
    const extractedFightStartTime = await dataService.extractFightStartTime(
      fightStartTime
    );
    const mappedEvents = await dataService.extractMappedDebuffEvents(
      combinedData,
      actors,
      boss.regions,
      reportCode,
      extractedFightStartTime,
      req.session.access_token
    );
    res.json(mappedEvents);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Fetches and filters the closest event to a given timestamp for a target
 * @param {Object} req - Express request object containing reportCode, targetID, startTime and fightIDs in query
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with filtered closest event or error
 */
exports.getClosestEvent = async (req, res) => {
  const { reportCode, targetID, startTime, fightIDs } = req.query;

  try {
    const events = await WarcraftLogsAPIInstance.fetchClosestEvent(
      reportCode,
      targetID,
      startTime,
      fightIDs,
      req.session.access_token
    );
    const filteredEvents = await dataService.extractClosestEvent(
      events,
      startTime
    );
    res.json(filteredEvents);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Fetches and filters title and author information for a given report
 * @param {Object} req - Express request object containing reportCode in query
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with filtered title and author data or error
 */
exports.getTitleAndAuthor = async (req, res) => {
  const { reportCode } = req.query;
  try {
    const TitleAndAuthor = await WarcraftLogsAPIInstance.fetchTitleAndAuthor(
      reportCode,
      req.session.access_token
    );
    const filterTitleAndAuthor = await dataService.extractAuthorAndTitle(
      TitleAndAuthor
    );
    res.json(filterTitleAndAuthor);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Fetches ability visibility settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with ability visibility data or error
 */
exports.getAbilityVisibility = async (req, res) => {
  try {
    const abilityVisibility = await dataService.extractAbilityVisibility();
    res.json(abilityVisibility);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
