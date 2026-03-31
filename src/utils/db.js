// src/utils/db.js or lib/db.js

import mongoose from "mongoose";

let isConnected = false; // Track connection status (for dev hot-reload)

export default async function dbConnect() {
  if (isConnected) return;

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("Please define MONGODB_URI in your .env.local");

    const db = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "healthbyte", // Optional: Specify your DB name here
    });

    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB connected:", db.connection.host);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
