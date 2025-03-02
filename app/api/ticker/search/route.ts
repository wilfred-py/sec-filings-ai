import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Ticker from "../../../models/Ticker";
import cache from "memory-cache"; // Import memory-cache

// Cache duration in milliseconds (1 hour = 3600 seconds = 3600000 ms)
const CACHE_DURATION = 3600000;

export async function GET(req: NextRequest) {
  const query = "";
  try {
    // Extract query parameter
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    // Generate a unique cache key based on the query
    const cacheKey = `ticker_search_${query.toLowerCase().trim()}`;

    // Check if result exists in cache
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log(`Cache hit for query: "${query}"`);
      return NextResponse.json(cachedResult);
    }

    // If not in cache, connect to DB and query
    await connectDB();
    const tickers = await Ticker.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    // Store result in cache with expiration
    cache.put(cacheKey, tickers, CACHE_DURATION);

    console.log(`Cache miss for query: "${query}", storing result`);
    return NextResponse.json(tickers);
  } catch (error) {
    console.error(`Error searching tickers for query "${query}":`, error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
