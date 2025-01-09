const redisClient = require("../services/redis-client");
const mongodbService = require("../services/mongodb-service");
exports.getLiveHealth = async (req, res) => {
  // Check for both IPv4 and IPv6 localhost formats
  if (
    req.ip !== "127.0.0.1" &&
    req.ip !== "::ffff:127.0.0.1" &&
    req.ip !== "::1" &&
    req.ip !== "::ffff:172.18.0.1"
  ) {
    res.status(403).json({ message: "Forbidden" });
  } else {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
        rss: process.memoryUsage().rss,
      },
      environment: process.env.NODE_ENV || "development",
    });
  }
};
