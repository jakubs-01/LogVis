const axios = require("axios");
const UserAuthService = require("../services/user-auth-service");

exports.login = (req, res) => {
  const state = UserAuthService.generateState();
  req.session.state = state;
  const redirectUri = UserAuthService.generateLoginUrl(state);
  res.redirect(redirectUri);
};

exports.logout = (req, res) => {
  req.session.destroy(function () {
    res.status(200).json({ message: "Logged out successfully" });
  });
};

exports.callback = async (req, res) => {
  const { code, state } = req.query;
  if (state !== req.session.state) {
    return res.status(400).json({ message: "Invalid state" });
  }

  const redirectUri = process.env.USER_AUTH_CALLBACK_ENDPOINT;
  try {
    const authData = await UserAuthService.handleCallback(code, redirectUri);
    req.session.userName = authData.userName;
    req.session.accessToken = authData.accessToken;
    req.session.refreshToken = authData.refreshToken;
    console.log(authData.userName);
    res.redirect(process.env.ORIGIN_URL);
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.status(500).json({
      error: "Error during callback",
      details: error.message,
      responseData: error.response?.data,
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const auth = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      "https://www.warcraftlogs.com/oauth/token",
      {
        grant_type: "refresh_token",
        refresh_token: req.session.refreshToken,
        client_id: process.env.CLIENT_ID,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );

    const { access_token, refresh_token } = response.data;
    req.session.accessToken = access_token;
    req.session.refreshToken = refresh_token;
    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Error refreshing token" });
  }
};

exports.user = (req, res) => {
  if (req.session.userName) {
    res.json({ userName: req.session.userName });
  } else {
    res.status(401).json({ message: "User not logged in" });
  }
};
