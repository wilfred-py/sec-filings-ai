import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

const TIMEOUT_MS = 5000;

export async function GET() {
  try {
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Health check timeout")), TIMEOUT_MS),
    );

    await Promise.race([connectPromise, timeoutPromise]);

    return NextResponse.json(
      { status: "ok" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        error: "Service unavailable",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
