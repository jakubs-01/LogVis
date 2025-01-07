// app.js
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const initializeServices = require("./services/initialize-services");
const reportRoutes = require("./routes/report-routes");
const logRoutes = require("./routes/log-routes");
const authRoutes = require("./routes/auth-routes");
const susLogger = require("./middleware/sus-logger");
const sessionConfig = require("./config/sessionConfig");

async function startServer() {
  const app = express();
  const port = process.env.PORT || 5000;
  await initializeServices();
  app.set("trust proxy", 2);
  app.use(
    cors({
      origin: [
        "https://www.jakubapp.dev/",
        "https://www.jakubapp.dev",
        "https://jakubapp.dev",
        "https://jakubapp.dev/",
        "https://logvis.jakubapp.dev/",
        "https://logvis.jakubapp.dev",
        "http://localhost:3000",
      ],
      credentials: true,
    })
  );
  app.use(sessionConfig);
  app.use(morgan("combined"));
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(susLogger);
  // Apply requestLogger only to /api routes
  app.use("/api", reportRoutes);

  app.use("/admin", logRoutes);
  app.use("/auth", authRoutes);
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

module.exports = { startServer };
