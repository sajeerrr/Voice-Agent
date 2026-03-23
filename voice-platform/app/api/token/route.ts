import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { room, identity } = body;

    if (!room) {
      return NextResponse.json(
        { error: "room is required" },
        { status: 400 }
      );
    }

    const participantIdentity = identity || `user-${Math.random().toString(36).slice(2, 9)}`;

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      // Return a mock token when LiveKit credentials are not configured
      return NextResponse.json({
        token: "mock-token-configure-livekit-env-vars",
        room,
        identity: participantIdentity,
        serverUrl: process.env.LIVEKIT_URL || "wss://your-livekit-server.livekit.cloud",
      });
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
    });

    token.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt = await token.toJwt();

    return NextResponse.json({
      token: jwt,
      room,
      identity: participantIdentity,
      serverUrl: process.env.LIVEKIT_URL,
    });
  } catch (error) {
    console.error("Failed to generate token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
