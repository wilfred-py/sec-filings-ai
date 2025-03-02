import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import Ticker from "../models/Ticker";
import connectDB from "../../lib/mongodb";

async function updateTickers() {
  try {
    await connectDB();
    const response = await fetch(
      "https://www.sec.gov/files/company_tickers.json",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const tickers = Object.values(data).map((item: any) => ({
      ticker: item.ticker,
      name: item.title,
    }));

    await Ticker.deleteMany({});
    await Ticker.insertMany(tickers);
    console.log("Tickers updated successfully");
  } catch (error) {
    console.error("Error updating tickers:", error);
  } finally {
    await mongoose.connection.close();
  }
}

updateTickers();
