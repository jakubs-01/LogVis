const crypto = require("crypto");
const axios = require("axios");
const WarcraftLogsAPIInstance = require("./api-service");

function generateLoginUrl(state) {
  return `https://www.warcraftlogs.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.USER_AUTH_CALLBACK_ENDPOINT}&state=${state}`;
}

function generateState() {
  return crypto.randomBytes(32).toString("base64url");
}

function getBasicAuth() {
  return Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString("base64");
}

async function handleCallback(code, redirectUri) {
  const auth = getBasicAuth();
  const response = await axios.post(
    "https://www.warcraftlogs.com/oauth/token",
    {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: process.env.CLIENT_ID,
    },
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    }
  );
  const { access_token, refresh_token } = response.data;
  if (access_token) {
    const userName = await WarcraftLogsAPIInstance.fetchAuthUserName(
      access_token
    );
    return {
      userName: userName.data.userData.currentUser.name,
      access_token,
      refresh_token,
    };
  }
  throw new Error("No access token received");
}

async function refreshToken(refreshToken) {
  const auth = getBasicAuth();
  const response = await axios.post(
    "https://www.warcraftlogs.com/oauth/token",
    {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.CLIENT_ID,
    },
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    }
  );
  const { access_token } = response.data;
  if (access_token) {
    return access_token;
  }
  throw new Error("No access token received");
}

module.exports = {
  generateLoginUrl,
  generateState,
  handleCallback,
  refreshToken,
};
