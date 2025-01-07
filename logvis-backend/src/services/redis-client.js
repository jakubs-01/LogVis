/**
 * @module services/redis-client
 * @description This module initializes a Redis client for connecting to a Redis database.
 */

const redis = require("redis");

/**
 * Creates a Redis client instance with configuration options.
 * @type {import('redis').RedisClientType}
 */
const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

/**
 * Event listener for successful connection to Redis.
 */
client.on("connect", () => {
  console.log("Connected to Redis Cloud!");
});

/**
 * Event listener for errors encountered by the Redis client.
 * @param {Error} err - The error object.
 */
client.on("error", (err) => {
  console.error("Redis Error:", err);
});

/**
 * Connects to the Redis client and logs the status.
 * @async
 */
(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("Redis Error:", err);
  }
})();

module.exports = client;
