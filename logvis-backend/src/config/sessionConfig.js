const session = require("express-session");
const RedisStore = require("connect-redis");
const redisClient = require("../services/redis-client");

const sessionConfig = session({
  store: new RedisStore.RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    httpOnly: process.env.NODE_ENV === "production" ? true : false,
    domain:
      process.env.NODE_ENV === "production" ? ".jakubapp.dev" : "localhost", // Enables cookies for all subdomains
  },
});

module.exports = sessionConfig;
