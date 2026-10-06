const mongoose = require("mongoose");

/**
 * Connect to MongoDB using MONGO_URI from environment.
 * Returns a promise that resolves when the connection is established.
 */
async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('MONGO_URI not set; skipping MongoDB connection (development mode)');
    return Promise.resolve(null);
  }

  const opts = {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  try {
    await mongoose.connect(mongoUri, opts);
    console.log("MongoDB connected");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
}

module.exports = connectDB;
