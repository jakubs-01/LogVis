/**
 * @fileoverview Service for handling authentication with the WarcraftLogs API
 * @module services/auth-service
 */

const axios = require("axios");
const btoa = require("btoa");
require("dotenv").config();

/**
 * Retrieves an access token from the WarcraftLogs OAuth endpoint
 * @async
 * @returns {Promise<string>} The access token if successful
 * @throws {Error} If the response is not OK or if authentication fails
 */
async function getAccessToken() {
  const authHeader =
    "Basic " + btoa(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET);

  try {
    const response = await axios.post(
      "https://www.warcraftlogs.com/oauth/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 200) {
      return response.data.access_token;
    } else {
      throw new Error(
        "Response was not OK: " + JSON.stringify(response.data ?? {})
      );
    }
  } catch (error) {
    throw new Error("Failed to get access token: " + error.message);
  }
}

module.exports = getAccessToken;
