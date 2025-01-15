/**
 * @fileoverview Service for interacting with the WarcraftLogs API, handling queries and caching responses
 * @module services/api-service
 */

const axios = require("axios");
const getAccessToken = require("./auth-service");
const NodeCache = require("node-cache");
const QUERIES = require("../graphql/queries");
const QueryLog = require("../models/querylog");
const logger = require("./logging-service");

/**
 * Class representing the WarcraftLogs API service
 */
class WarcraftLogsAPI {
  /**
   * Creates a WarcraftLogsAPI instance
   * @constructor
   */
  constructor() {
    this.server_access_token = null;
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
    this.server_access_token = await getAccessToken();
  }

  /**
   * Executes a GraphQL query against the WarcraftLogs API
   * @async
   * @param {string} query - The GraphQL query to execute
   * @param {Object} variables - Query variables
   * @param {string} [user_access_token] - Optional access token for authentication
   * @returns {Promise<Object>} The query response data
   * @throws {Error} If the query fails or returns errors
   */
  async executeQuery(query, variables, user_access_token) {
    const startTime = performance.now(); // Start timing
    if (process.env.NODE_ENV === "development") {
      const regex = /query\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
      const match = query.match(regex);
      if (match) {
        const queryName = match[0];
        logger.debug("Executing query", { queryName, variables });
      }
    }
    let fromCache = false;
    try {
      const cacheKey =
        this._generateCacheKey(query, variables) +
        (user_access_token ? `_${user_access_token}` : "");
      const cachedData = this.cache.get(cacheKey);

      if (cachedData) {
        fromCache = true;
        return cachedData;
      }

      const headers = {
        Authorization: `Bearer ${
          user_access_token ? user_access_token : this.server_access_token
        }`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        user_access_token ? this.authEndpoint : this.endpoint,
        { query, variables },
        { headers }
      );
      if (response.data.errors) {
        const errorMessage = response.data.errors[0].message;
        throw new Error(`GraphQL Error: ${errorMessage}`);
      }
      this.cache.set(cacheKey, response.data);
      if (user_access_token) {
        this.cache.set(`${cacheKey}_token`, user_access_token);
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
   * @param {string} [user_access_token] - Optional access token
   * @returns {Promise<Object>} The title and author data
   * @throws {Error} If reportCode is missing or invalid
   */
  async fetchTitleAndAuthor(reportCode, user_access_token) {
    if (!reportCode) {
      throw new Error("Report code is missing");
    }
    if (typeof reportCode !== "string") {
      throw new Error("Report code must be a string");
    }
    const query = QUERIES.FETCH_TITLE_AND_AUTHOR;
    return this.executeQuery(query, { reportCode }, user_access_token);
  }

  /**
   * Fetches fight data from a report
   * @async
   * @param {string} reportCode - The report code to fetch fights from
   * @param {string} [user_access_token] - Optional access token
   * @returns {Promise<Object>} The fights data
   * @throws {Error} If reportCode is missing or invalid
   */
  async fetchFights(reportCode, user_access_token) {
    if (!reportCode) {
      throw new Error("Report code is missing");
    }
    if (typeof reportCode !== "string") {
      throw new Error("Report code must be a string");
    }
    const query = QUERIES.FETCH_FIGHTS;
    return this.executeQuery(query, { reportCode }, user_access_token);
  }

  /**
   * Fetches the start time of a specific fight
   * @async
   * @param {string} reportCode - The report code
   * @param {string|number} fightID - The fight ID
   * @param {string} [user_access_token] - Optional access token
   * @returns {Promise<Object>} The fight start time data
   * @throws {Error} If reportCode or fightID is missing or invalid
   */
  async fetchFightStartTime(reportCode, fightID, user_access_token) {
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
    return this.executeQuery(
      query,
      { reportCode, parsedfightID },
      user_access_token
    );
  }

  /**
   * Fetches actor data from a report
   * @async
   * @param {string} reportCode - The report code
   * @param {string} [user_access_token] - Optional access token
   * @returns {Promise<Object>} The actors data
   * @throws {Error} If reportCode is missing or invalid
   */
  async fetchActors(reportCode, user_access_token) {
    if (!reportCode) {
      throw new Error("Report code is missing");
    }
    if (typeof reportCode !== "string") {
      throw new Error("Report code must be a string");
    }
    const query = QUERIES.FETCH_ACTORS;
    return this.executeQuery(query, { reportCode }, user_access_token);
  }

  /**
   * Fetches damage events for a specific ability and fight
   * @async
   * @param {string} reportCode - The report code
   * @param {string|number} abilityID - The ability ID
   * @param {string|number} fightID - The fight ID
   * @param {string} [user_access_token] - Optional access token
   * @returns {Promise<Object>} The damage events data
   * @throws {Error} If any required parameter is missing or invalid
   */
  async fetchDamageEvents(reportCode, abilityID, fightID, user_access_token) {
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
      user_access_token
    );
  }

  /**
   * Fetches debuff events for a specific ability and fight
   * @async
   * @param {string} reportCode - The report code
   * @param {string|number} abilityID - The ability ID
   * @param {string|number} fightID - The fight ID
   * @param {string} [user_access_token] - Optional access token
   * @returns {Promise<Object>} The debuff events data
   * @throws {Error} If any required parameter is missing or invalid
   */
  async fetchDebuffEvents(reportCode, abilityID, fightID, user_access_token) {
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
      user_access_token
    );
  }

  /**
   * Fetches the closest event to a specific time for a target
   * @async
   * @param {string} reportCode - The report code
   * @param {string|number} targetID - The target ID
   * @param {string|number} startTime - The reference time
   * @param {string|number} fightID - The fight ID
   * @param {string} [user_access_token] - Optional access token
   * @returns {Promise<Object>} The closest event data
   * @throws {Error} If any required parameter is missing or invalid
   */
  async fetchClosestEvent(
    reportCode,
    targetID,
    startTime,
    fightID,
    user_access_token
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
    const parsedendTime = startTime + 1000;
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
      user_access_token
    );
  }

  /**
   * Fetches the authenticated user's name
   * @async
   * @param {string} user_access_token - The access token for authentication
   * @returns {Promise<Object>} The user name data
   */
  async fetchAuthUserName(user_access_token) {
    const query = QUERIES.FETCH_AUTH_USER_NAME;
    return this.executeQuery(query, {}, user_access_token);
  }

  async fetchApiResponse() {
    const query = QUERIES.FETCH_API_RESPONSE;
    return this.executeQuery(query, {});
  }
}

const WarcraftLogsAPIInstance = new WarcraftLogsAPI();

module.exports = WarcraftLogsAPIInstance;
