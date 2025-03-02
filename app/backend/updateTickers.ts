import mongoose from "mongoose";
import Ticker from "../models/Ticker";
import connectDB from "@/lib/mongodb";

async function updateTickers() {
  try {
    await connectDB();
    const response = await fetch(
      "https://www.sec.gov/files/company_tickers.json",
    );
    const data = await response.json();
    const tickers = Object.values(data).map((item: any) => ({
      ticker: item.ticker,
      name: item.title,
    }));
    await Ticker.deleteMany({});
    await Ticker.insertMany(tickers);
    console.log("Tickers updated");
  } catch (error) {
    console.error("Error updating tickers:", error);
  } finally {
    await mongoose.connection.close();
  }
}

updateTickers();
