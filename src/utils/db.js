import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connStr = process.env.MONGODB_URI || "mongodb://localhost:27017/profilio";
    console.log(`Connecting to MongoDB at ${connStr.replace(/:([^:@]+)@/, ":****@")}...`);
    
    const conn = await mongoose.connect(connStr);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
}
