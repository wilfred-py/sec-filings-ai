import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import cron from "node-cron";
import { updateTickers } from "./updateTickers";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

cron.schedule("0 0 * * *", updateTickers); // Runs daily at midnight

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define routes
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
