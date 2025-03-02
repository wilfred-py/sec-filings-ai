import { NextRequest, NextResponse } from "next/server";
import TrackedTicker from "../../../../../../models/TrackedTicker";
import { getSession } from "@/lib/session-server";
import connectDB from "@/lib/mongodb";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { ticker: string; tag: string } },
) {
  const session = await getSession(req);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const result = await TrackedTicker.updateOne(
      { userId: session.user.id, ticker: params.ticker },
      { $pull: { tags: params.tag } },
    );
    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    return NextResponse.json({ message: "Tag removed" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove tag" },
      { status: 500 },
    );
  }
}
