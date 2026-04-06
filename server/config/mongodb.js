import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.error(
      "Missing MONGODB_URI. Create server/.env with e.g. MONGODB_URI=mongodb://127.0.0.1:27017/usims (see server/.env.example)."
    );
    throw new Error("MONGODB_URI is not configured");
  }

  if (!/^mongodb(\+srv)?:\/\//i.test(uri)) {
    console.error(
      "MONGODB_URI must start with mongodb:// or mongodb+srv:// — check server/.env for typos or quotes around the value."
    );
    throw new Error("Invalid MONGODB_URI format");
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10_000,
    });
  } catch (err) {
    const hint =
      uri.includes("127.0.0.1") || uri.includes("localhost")
        ? "Is MongoDB running locally? Try: mongosh, or start MongoDB service."
        : "Check Atlas IP allowlist, user/password, and cluster host in the connection string.";
    console.error("Could not connect to MongoDB.", hint);
    throw err;
  }

  const name = mongoose.connection.name;
  const host = mongoose.connection.host;
  console.log(`Database connected (${host}${name ? ` / ${name}` : ""})`);
};

export default connectDB;
