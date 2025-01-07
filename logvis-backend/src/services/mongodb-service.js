const mongoose = require("mongoose");

class Database {
  constructor(uri) {
    this.uri = uri;
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mongoose.connect(this.uri);
      console.log("Connected to MongoDB");
      return this.connection;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  getConnection() {
    if (!this.connection) {
      throw new Error("Database not initialized. Call connect() first.");
    }
    return this.connection;
  }
}

module.exports = Database;
