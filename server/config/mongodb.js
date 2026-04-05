import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const tryConnect = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set in .env");
    return false;
  }
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });
  return true;
};

/**
 * Keeps retrying until MongoDB is reachable so signup/login work after Atlas/DNS blips.
 */
const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database Connected"));
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected — will retry in background");
    scheduleReconnect();
  });

  let attempt = 0;
  while (true) {
    try {
      await tryConnect();
      return;
    } catch (error) {
      attempt += 1;
      console.error(
        `MongoDB connect attempt ${attempt} failed:`,
        error.message
      );
      const delay = Math.min(3000 * attempt, 30000);
      await sleep(delay);
    }
  }
};

let reconnectTimer = null;
const scheduleReconnect = () => {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    if (mongoose.connection.readyState === 1) return;
    try {
      await tryConnect();
      console.log("Database reconnected");
    } catch (e) {
      console.error("Reconnect failed:", e.message);
      scheduleReconnect();
    }
  }, 5000);
};

export default connectDB;
