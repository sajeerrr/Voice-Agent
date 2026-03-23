import { NextResponse } from "next/server";

// This route is deprecated in the new Hestia schema
export async function GET() {
  return NextResponse.json({ error: "This endpoint has been removed" }, { status: 410 });
}
