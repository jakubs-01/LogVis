const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: format.simple(),
  transports: [
    new transports.Console({
      silent: process.env.NODE_ENV !== "development",
    }),
  ],
});

module.exports = logger;
