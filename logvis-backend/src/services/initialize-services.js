const Database = require("./mongodb-service");
const WarcraftLogsAPIInstance = require("./api-service");

async function initializeServices() {
  const database = new Database(process.env.MONGODB_URI);
  await database.connect();
  await WarcraftLogsAPIInstance.initialize();
  try {
    const response = await WarcraftLogsAPIInstance.fetchApiResponse();
    if (response.data) {
      console.log("Warcraft Logs API successfully initialized");
    }
  } catch (error) {
    console.error("Error connecting to Warcraft Logs API: ", error.message);
  }
}

module.exports = initializeServices;
