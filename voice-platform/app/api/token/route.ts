import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { RoomAgentDispatch, RoomConfiguration } from "@livekit/protocol";

const AGENT_NAME = "voice-assistant";

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
    const serverUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !serverUrl) {
      return NextResponse.json(
        {
          error:
            "LiveKit is not configured. Set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET.",
        },
        { status: 500 }
      );
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
    token.roomConfig = new RoomConfiguration({
      agents: [
        new RoomAgentDispatch({
          agentName: AGENT_NAME,
        }),
      ],
    });

    const jwt = await token.toJwt();

    return NextResponse.json({
      token: jwt,
      room,
      identity: participantIdentity,
      serverUrl,
    });
  } catch (error) {
    console.error("Failed to generate token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
