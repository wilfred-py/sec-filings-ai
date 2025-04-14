import { NextRequest, NextResponse } from "next/server";
import TrackedTicker from "../../../../models/TrackedTicker";
import { getSession } from "@/lib/session-server";
import connectDB from "@/lib/mongodb";

export async function DELETE(
  req: NextRequest,
  context: { params: { ticker: string } },
) {
  console.log("DELETE request received for ticker:", context.params.ticker);

  try {
    // 1. Session check with better error handling
    const session = await getSession(req);
    console.log("Session retrieved:", session ? "success" : "null");

    if (!session?.user?.id) {
      console.log("Unauthorized: No valid user session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Connect to DB with timeout
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connection successful");

    // 3. Execute deletion with better error handling
    console.log(
      `Attempting to delete ticker ${context.params.ticker} for user ${session.user.id}`,
    );
    const result = await TrackedTicker.deleteOne({
      userId: session.user.id,
      ticker: context.params.ticker,
    });

    console.log("Delete operation result:", result);

    if (result.deletedCount === 0) {
      console.log("Ticker not found in database");
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    }

    console.log("Ticker successfully removed");
    return NextResponse.json({ message: "Ticker removed" });
  } catch (error) {
    // Improved error logging
    console.error(
      `Error processing DELETE request for ticker ${context.params.ticker}:`,
    );
    console.error(error instanceof Error ? error.stack : error);

    return NextResponse.json(
      {
        error: "Failed to remove ticker",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
