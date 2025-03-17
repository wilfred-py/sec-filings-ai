import mongoose from "mongoose";
import connectDB from "./mongodb";

// Import all model schemas here
import "@/app/models/User";
import "@/app/models/Session";

/**
 * Initialize all database models
 * This ensures all schemas are registered before any queries run
 */
export async function initializeModels() {
  await connectDB();

  // Force load all models to ensure they're registered
  const models = mongoose.modelNames();
  console.log("Registered models:", models);

  return {
    User: mongoose.model("User"),
    Session: mongoose.model("Session"),
    // Add other models as needed
  };
}

export default initializeModels;
