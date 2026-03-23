"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useRoomContext,
  useConnectionState,
  TrackToggle,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";

interface CallControlsProps {
  roomId: string;
}

export default function CallControls({ roomId }: CallControlsProps) {
  const router = useRouter();
  const room = useRoomContext();
  const connectionState = useConnectionState();
  const [ending, setEnding] = useState(false);

  const isConnected = connectionState === ConnectionState.Connected;
  const isConnecting = connectionState === ConnectionState.Connecting;

  async function handleEndCall() {
    setEnding(true);
    try {
      await room.disconnect();
      // Find the session by roomId and end it
      const sessionsRes = await fetch("/api/session");
      if (sessionsRes.ok) {
        const sessions = await sessionsRes.json();
        const session = sessions.find(
          (s: { roomId: string }) => s.roomId === roomId
        );
        if (session) {
          await fetch("/api/session/end", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: session.id }),
          });
        }
      }
    } catch (err) {
      console.error("Error ending call:", err);
    }
    router.push("/sessions");
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isConnected
              ? "bg-green-500 animate-pulse"
              : isConnecting
                ? "bg-yellow-500 animate-pulse"
                : "bg-zinc-400"
          }`}
        />
        <span className="text-sm font-medium text-muted">
          {isConnected
            ? "Connected"
            : isConnecting
              ? "Connecting..."
              : connectionState}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <TrackToggle
          source={Track.Source.Microphone}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-card-hover data-[lk-muted=true]:bg-red-500/10 data-[lk-muted=true]:text-red-400"
        />
        <button
          onClick={handleEndCall}
          disabled={ending}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700 active:bg-red-800 disabled:opacity-50"
          title="End call"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
