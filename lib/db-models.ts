import mongoose from "mongoose";
import connectDB from "./mongodb";

// Import all models from the index file
import * as models from "@/app/models";

/**
 * Initialize all database models
 * This ensures all schemas are registered before any queries run
 */
export async function initializeModels() {
  await connectDB();

  // Force models to be registered by accessing each model in the imported object
  Object.values(models);

  // Get a list of all registered models
  const registeredModelNames = mongoose.modelNames();
  console.log("Registered models:", registeredModelNames);

  // Dynamically create an object with all registered models
  const registeredModels = registeredModelNames.reduce(
    (acc, modelName) => {
      try {
        acc[modelName] = mongoose.model(modelName);
      } catch (err) {
        console.error(`Error retrieving model ${modelName}:`, err);
      }
      return acc;
    },
    {} as Record<string, mongoose.Model<any>>,
  );

  return registeredModels;
}

export default initializeModels;
