/**
 * @fileoverview Service for interacting with the WarcraftLogs API, handling queries and caching responses
 * @module services/api-service
 */

const axios = require("axios");
const getAccessToken = require("./auth-service");
const NodeCache = require("node-cache");
const QUERIES = require("../graphql/queries");
const QueryLog = require("../models/querylog");

/**
 * Class representing the WarcraftLogs API service
 */
class WarcraftLogsAPI {
  /**
   * Creates a WarcraftLogsAPI instance
   * @constructor
   */
  constructor() {
    this.accessToken = null;
    this.endpoint = process.env.ENDPOINT_URL;
    this.authEndpoint = process.env.ENDPOINT_AUTH_URL;
    this.cache = new NodeCache({
      stdTTL: 60 * 60 * 24, // 24 hours
      checkperiod: 60 * 60 * 24, // 24 hours
    });
  }

  /**
   * Generates a cache key from query and variables
   * @private
   * @param {string} query - The GraphQL query
   * @param {Object} variables - Query variables
   * @returns {string} The generated cache key
   */
  _generateCacheKey(query, variables) {
    return `${query}_${JSON.stringify(variables)}`;
  }

  /**
   * Initializes the API service by fetching an access token
   * @async
   */
  async initialize() {
    this.accessToken = await getAccessToken();
  }

  /**
   * Executes a GraphQL query against the WarcraftLogs API
   * @async
   * @param {string} query - The GraphQL query to execute
   * @param {Object} variables - Query variables
   * @param {string} [accessToken] - Optional access token for authentication
   * @returns {Promise<Object>} The query response data
   * @throws {Error} If the query fails or returns errors
   */
  async executeQuery(query, variables, accessToken) {
    const startTime = performance.now(); // Start timing
    let fromCache = false;
    try {
      const cacheKey =
        this._generateCacheKey(query, variables) +
        (accessToken ? `_${accessToken}` : "");
      const cachedData = this.cache.get(cacheKey);

      if (cachedData) {
        fromCache = true;
        return cachedData;
      }

      const headers = {
        Authorization: `Bearer ${accessToken ? accessToken : this.accessToken}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        accessToken ? this.authEndpoint : this.endpoint,
        { query, variables },
        { headers }
      );
      if (response.data.errors) {
        const errorMessage = response.data.errors[0].message;
        throw new Error(`GraphQL Error: ${errorMessage}`);
      }
      this.cache.set(cacheKey, response.data);
      if (accessToken) {
        this.cache.set(`${cacheKey}_token`, accessToken);
      }
      return response.data;
    } catch (error) {
      if (error.message) {
        throw error;
      }
      throw new Error(
        "An unknown error occurred with the WarcraftLogsAPI module"
      );
    } finally {
      const endTime = performance.now(); // End timing
      const duration = endTime - startTime; // Calculate duration
      const queryLogEntry = new QueryLog({
        query,
        variables,
        duration,
        fromCache,
      });
      await queryLogEntry.save();
    }
  }

  /**
   * Fetches report title and author information
   * @async
   * @param {string} reportCode - The report code to fetch data for
   * @param {string} [accessToken] - Optional access token
   * @returns {Promise<Object>} The title and author data
   * @throws {Error} If reportCode is missing or invalid
   */
  async fetchTitleAndAuthor(reportCode, accessToken) {
    if (!reportCode) {
      throw new Error("Report code is missing");
    }
    if (typeof reportCode !== "string") {
      throw new Error("Report code must be a string");
    }
    const query = QUERIES.FETCH_TITLE_AND_AUTHOR;
    return this.executeQuery(query, { reportCode }, accessToken);
  }

  /**
   * Fetches fight data from a report
   * @async
   * @param {string} reportCode - The report code to fetch fights from
   * @param {string} [accessToken] - Optional access token
   * @returns {Promise<Object>} The fights data
   * @throws {Error} If reportCode is missing or invalid
   */
  async fetchFights(reportCode, accessToken) {
    if (!reportCode) {
      throw new Error("Report code is missing");
    }
    if (typeof reportCode !== "string") {
      throw new Error("Report code must be a string");
    }
    const query = QUERIES.FETCH_FIGHTS;
    return this.executeQuery(query, { reportCode }, accessToken);
  }

  /**
   * Fetches the start time of a specific fight
   * @async
   * @param {string} reportCode - The report code
   * @param {string|number} fightID - The fight ID
   * @param {string} [accessToken] - Optional access token
   * @returns {Promise<Object>} The fight start time data
   * @throws {Error} If reportCode or fightID is missing or invalid
   */
  async fetchFightStartTime(reportCode, fightID, accessToken) {
    if (!reportCode) {
      throw new Error("Report code is missing");
    }
    if (!fightID) {
      throw new Error("Fight ID is missing");
    }
    if (typeof reportCode !== "string") {
      throw new Error("Report code must be a string");
    }

    const parsedfightID = parseInt(fightID);
    const query = QUERIES.FETCH_FIGHT_STARTTIME;
    return this.executeQuery(query, { reportCode, parsedfightID }, accessToken);
  }

  /**
   * Fetches actor data from a report
   * @async
   * @param {string} reportCode - The report code
   * @param {string} [accessToken] - Optional access token
   * @returns {Promise<Object>} The actors data
   * @throws {Error} If reportCode is missing or invalid
   */
  async fetchActors(reportCode, accessToken) {
    if (!reportCode) {
      throw new Error("Report code is missing");
    }
    if (typeof reportCode !== "string") {
      throw new Error("Report code must be a string");
    }
    const query = QUERIES.FETCH_ACTORS;
    return this.executeQuery(query, { reportCode }, accessToken);
  }

  /**
   * Fetches damage events for a specific ability and fight
   * @async
   * @param {string} reportCode - The report code
   * @param {string|number} abilityID - The ability ID
   * @param {string|number} fightID - The fight ID
   * @param {string} [accessToken] - Optional access token
   * @returns {Promise<Object>} The damage events data
   * @throws {Error} If any required parameter is missing or invalid
   */
  async fetchDamageEvents(reportCode, abilityID, fightID, accessToken) {
    if (!reportCode) {
      throw new Error("Report code is missing");
    }
    if (!abilityID) {
      throw new Error("Ability ID is missing");
    }
    if (!fightID) {
      throw new Error("Fight ID is missing");
    }
    if (typeof reportCode !== "string") {
      throw new Error("Report code must be a string");
    }

    const parsedabilityID = parseInt(abilityID);
    const parsedfightID = parseInt(fightID);
    const query = QUERIES.FETCH_DAMAGE_EVENTS;
    return this.executeQuery(
      query,
      {
        reportCode,
        parsedabilityID,
        parsedfightID,
      },
      accessToken
    );
  }

  /**
   * Fetches debuff events for a specific ability and fight
   * @async
   * @param {string} reportCode - The report code
   * @param {string|number} abilityID - The ability ID
   * @param {string|number} fightID - The fight ID
   * @param {string} [accessToken] - Optional access token
   * @returns {Promise<Object>} The debuff events data
   * @throws {Error} If any required parameter is missing or invalid
   */
  async fetchDebuffEvents(reportCode, abilityID, fightID, accessToken) {
    if (!reportCode) {
      throw new Error("Report code is missing");
    }
    if (!abilityID) {
      throw new Error("Ability ID is missing");
    }
    if (!fightID) {
      throw new Error("Fight ID is missing");
    }
    if (typeof reportCode !== "string") {
      throw new Error("Report code must be a string");
    }
    const parsedabilityID = parseInt(abilityID);
    const parsedfightID = parseInt(fightID);
    const query = QUERIES.FETCH_DEBUFF_EVENTS;
    return this.executeQuery(
      query,
      {
        reportCode,
        parsedabilityID,
        parsedfightID,
      },
      accessToken
    );
  }

  /**
   * Fetches the closest event to a specific time for a target
   * @async
   * @param {string} reportCode - The report code
   * @param {string|number} targetID - The target ID
   * @param {string|number} startTime - The reference time
   * @param {string|number} fightID - The fight ID
   * @param {string} [accessToken] - Optional access token
   * @returns {Promise<Object>} The closest event data
   * @throws {Error} If any required parameter is missing or invalid
   */
  async fetchClosestEvent(
    reportCode,
    targetID,
    startTime,
    fightID,
    accessToken
  ) {
    if (!reportCode) {
      throw new Error("Report code is missing");
    }
    if (!targetID) {
      throw new Error("Target ID is missing");
    }
    if (!startTime) {
      throw new Error("Start time is missing");
    }
    if (!fightID) {
      throw new Error("Fight ID is missing");
    }
    if (typeof reportCode !== "string") {
      throw new Error("Report code must be a string");
    }
    const parsedtargetID = parseInt(targetID);
    const parsedstartTime = parseFloat(startTime) - 1000;
    const parsedendTime = startTime + 2000;
    const parsedfightID = parseInt(fightID);
    const query = QUERIES.FETCH_CLOSEST_EVENT;
    return this.executeQuery(
      query,
      {
        reportCode,
        parsedtargetID,
        parsedstartTime,
        parsedendTime,
        parsedfightID,
      },
      accessToken
    );
  }

  /**
   * Fetches the authenticated user's name
   * @async
   * @param {string} accessToken - The access token for authentication
   * @returns {Promise<Object>} The user name data
   */
  async fetchAuthUserName(accessToken) {
    const query = QUERIES.FETCH_AUTH_USER_NAME;
    return this.executeQuery(query, {}, accessToken);
  }
}

const WarcraftLogsAPIInstance = new WarcraftLogsAPI();

module.exports = WarcraftLogsAPIInstance;
