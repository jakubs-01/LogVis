const Database = require("./mongodb-service");
const WarcraftLogsAPIInstance = require("./api-service");

async function initializeServices() {
  const database = new Database(process.env.MONGODB_URI);
  await database.connect();
  await WarcraftLogsAPIInstance.initialize();
}

module.exports = initializeServices;
