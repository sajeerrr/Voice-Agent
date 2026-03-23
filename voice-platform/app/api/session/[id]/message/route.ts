import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/session/[id]/message — Append a transcript message to a session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role, content } = body;

    if (!role || !content) {
      return NextResponse.json(
        { error: "role and content are required" },
        { status: 400 }
      );
    }

    if (role !== "user" && role !== "assistant") {
      return NextResponse.json(
        { error: "role must be 'user' or 'assistant'" },
        { status: 400 }
      );
    }

    const session = await prisma.session.findUnique({ where: { id } });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const message = await prisma.message.create({
      data: {
        sessionId: id,
        role,
        content,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Failed to save message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
