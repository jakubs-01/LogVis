const crypto = require("crypto");
const axios = require("axios");
const WarcraftLogsAPIInstance = require("../services/api-service");

exports.login = (req, res) => {
  function generateVerifier() {
    const verifier = crypto.randomBytes(32).toString("base64url");
    return verifier;
  }

  function generateChallenge(verifier) {
    return crypto.createHash("sha256").update(verifier).digest("base64url");
  }
  const codeVerifier = generateVerifier();
  const codeChallenge = generateChallenge(codeVerifier);
  req.session.codeVerifier = codeVerifier; // Store in session
  const clientId = process.env.CLIENT_ID;
  const redirectUri = encodeURIComponent(
    process.env.USER_AUTH_CALLBACK_ENDPOINT
  );
  const authUrl = `https://www.warcraftlogs.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  res.redirect(authUrl);
};

exports.logout = (req, res) => {
  req.session.destroy(function () {
    res.status(200).json({ message: "Logged out successfully" });
  });
};

exports.callback = async (req, res) => {
  const code = req.query.code;
  const clientId = process.env.CLIENT_ID;
  const redirectUri = encodeURIComponent(
    process.env.USER_AUTH_CALLBACK_ENDPOINT
  );

  try {
    const verifier = req.session.codeVerifier; // Get from session instead of localStorage
    const auth = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    ).toString("base64");
    const response = await axios.post(
      "https://www.warcraftlogs.com/oauth/token",
      {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: decodeURIComponent(redirectUri), // Decode the URI for the request
        client_id: clientId,
        code_verifier: verifier,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );
    const accessToken = response.data.access_token;
    if (accessToken) {
      const userName = await WarcraftLogsAPIInstance.fetchAuthUserName(
        accessToken
      );
      const data = userName.data.userData.currentUser.name;
      req.session.userName = data;
    }
    req.session.accessToken = accessToken;

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

exports.user = (req, res) => {
  if (req.session.userName) {
    res.json({ userName: req.session.userName });
  } else {
    res.status(401).json({ message: "User not logged in" });
  }
};
