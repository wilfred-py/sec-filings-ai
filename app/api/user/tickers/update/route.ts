// app/api/tickers/update/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Ticker from "@/app/models/Ticker";
import connectDB from "@/lib/mongodb";
import cache from "memory-cache";

interface EdgarTicker {
  cik_str: string;
  ticker: string;
  title: string;
}

interface EdgarResponse {
  [key: string]: EdgarTicker;
}

export async function GET() {
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

    const data = (await response.json()) as EdgarResponse;
    const tickers = Object.values(data).map((item: EdgarTicker) => ({
      ticker: item.ticker,
      name: item.title,
      cik: item.cik_str,
    }));

    // Incremental update with upsert
    const bulkOps = tickers.map((ticker) => ({
      updateOne: {
        filter: { ticker: ticker.ticker },
        update: { $set: ticker },
        upsert: true,
      },
    }));

    await Ticker.bulkWrite(bulkOps);
    cache.clear(); // Clear cache to reflect new data

    return NextResponse.json({
      message: "Tickers updated successfully",
      count: tickers.length,
    });
  } catch (error) {
    console.error("Error updating tickers:", error);
    return NextResponse.json(
      {
        error: "Failed to update tickers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Optional: Run as script if called directly
if (
  process.env.NODE_ENV === "development" &&
  !process.env.NEXT_PUBLIC_API_URL
) {
  (async () => {
    await GET();
    await mongoose.connection.close();
    process.exit(0);
  })();
}
