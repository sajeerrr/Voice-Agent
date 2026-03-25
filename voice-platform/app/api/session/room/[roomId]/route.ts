import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/session/room/[roomId] — Find a session by room id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;

    const session = await prisma.session.findUnique({
      where: { roomId: decodeURIComponent(roomId) },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Failed to fetch session by room id:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
