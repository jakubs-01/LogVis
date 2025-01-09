const Log = require("../models/log");

const susLogger = (req, res, next) => {
  const allowedPaths = [
    // Auth routes
    "/auth/login",
    "/auth/logout",
    "/auth/status",
    "/auth/callback",
    "/auth/user",

    // Admin routes
    "/admin/logs",
    "/admin/querylogs",
    "/admin/ipinfo",

    // API routes
    "/api/reports",
    "/api/logs",
    "/api/fights",
    "/api/actors",
    "/api/damageevents",
    "/api/titleandauthor",
    "/api/debuffevents",
    "/api/closestevent",
    "/api/abilityvisibility",

    //Health Check
    "/health",
  ];

  if (
    !allowedPaths.some((path) => req.path.toLowerCase() === path.toLowerCase())
  ) {
    const { method, url, headers, body } = req;
    let ip = req.ip || req.connection.remoteAddress;

    if (ip !== undefined && ip.startsWith("::ffff:")) {
      ip = ip.substring(7);
    }

    const requestDetails = {
      method,
      url,
      headers,
      body,
      timestamp: new Date(),
      ip,
    };
    res.on("finish", async () => {
      const { statusCode } = res;

      const responseDetails = {
        statusCode,
      };

      const logEntry = new Log({
        request: requestDetails,
        response: responseDetails,
      });

      try {
        await logEntry.save();
      } catch (error) {
        console.error("Error saving log:", error);
      }
    });
  }
  next();
};

module.exports = susLogger;
