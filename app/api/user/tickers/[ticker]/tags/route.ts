import { NextRequest, NextResponse } from "next/server";
import TrackedTicker from "../../../../../models/TrackedTicker";
import { getSession } from "@/lib/session-server";
import connectDB from "@/lib/mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: { ticker: string } },
) {
  const session = await getSession(req);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const { tag } = await req.json();
    if (!tag)
      return NextResponse.json({ error: "Tag required" }, { status: 400 });
    const result = await TrackedTicker.updateOne(
      { userId: session.user.id, ticker: params.ticker },
      { $addToSet: { tags: tag } },
    );
    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    return NextResponse.json({ message: "Tag added" });
  } catch (error) {
    console.error(`Error adding tag to ticker ${params.ticker}:`, error);
    return NextResponse.json({ error: "Failed to add tag" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { ticker: string } },
) {
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const ticker = await TrackedTicker.findOne({
      userId: session.user.id,
      ticker: params.ticker,
    });

    if (!ticker) {
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    }

    return NextResponse.json({ tags: ticker.tags || [] });
  } catch (error) {
    console.error(`Error fetching tags for ticker ${params.ticker}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 },
    );
  }
}
