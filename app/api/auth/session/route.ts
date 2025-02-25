import { getCurrentSession } from "@/lib/session-server";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getCurrentSession();
  return NextResponse.json(result);
}
