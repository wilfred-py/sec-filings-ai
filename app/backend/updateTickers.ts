import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import Ticker from "../models/Ticker";
import connectDB from "../../lib/mongodb";

// Define the type for each item in company_tickers.json
interface EdgarTicker {
  cik_str: string;
  ticker: string;
  title: string;
}

// Define the type for the full JSON response
interface EdgarResponse {
  [key: string]: EdgarTicker;
}

export async function updateTickers() {
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

    // Cast result of response.json() to EdgarResponse
    const data = (await response.json()) as EdgarResponse;
    const tickers = Object.values(data).map((item: EdgarTicker) => ({
      ticker: item.ticker,
      name: item.title,
      cik: item.cik_str,
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

// Self-executing async function for ESM
updateTickers()
  .then(() => {
    console.log("Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
