import { NextRequest, NextResponse } from "next/server";
import TrackedTicker from "../../../../models/TrackedTicker";
import { getSession } from "@/lib/session-server";
import connectDB from "@/lib/mongodb";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { ticker: string } },
) {
  const session = await getSession(req);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    console.log("Deleting ticker", params.ticker);
    await connectDB();
    const result = await TrackedTicker.deleteOne({
      userId: session.user.id,
      ticker: params.ticker,
    });
    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    return NextResponse.json({ message: "Ticker removed" });
  } catch (error) {
    console.error(`Error deleting ticker ${params.ticker}: `, error);
    return NextResponse.json(
      { error: "Failed to remove ticker" },
      { status: 500 },
    );
  }
}
