import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRoomId } from "@/lib/livekit";

// GET /api/session — List all sessions
export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { startedAt: "desc" },
    });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST /api/session — Create a new session with generated room_id
export async function POST() {
  try {
    const roomId = generateRoomId();

    const session = await prisma.session.create({
      data: { roomId },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Failed to create session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
