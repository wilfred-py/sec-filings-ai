import { NextRequest, NextResponse } from "next/server";
import TrackedTicker from "../../../models/TrackedTicker";
import Ticker from "../../../models/Ticker";
import { getSession } from "@/lib/session-server";
import connectDB from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const tickers = await TrackedTicker.find({ userId: session.user.id });
    return NextResponse.json(tickers);
  } catch (error) {
    console.error("Failed to fetch tickers:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch tickers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const { ticker } = await req.json();
    if (!ticker)
      return NextResponse.json({ error: "Ticker required" }, { status: 400 });
    const exists = await Ticker.findOne({ ticker });
    if (!exists)
      return NextResponse.json({ error: "Invalid ticker" }, { status: 404 });
    await TrackedTicker.create({ userId: session.user.id, ticker, tags: [] });
    return NextResponse.json({ message: "Ticker added" });
  } catch (error) {
    console.error("Failed to add ticker:", error);
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { error: "Ticker already tracked" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      {
        error: "Failed to add ticker",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
