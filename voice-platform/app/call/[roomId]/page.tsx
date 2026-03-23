"use client";

import { useEffect, useState, use } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import CallControls from "@/components/CallControls";

interface TokenResponse {
  token: string;
  room: string;
  identity: string;
  serverUrl: string;
}

interface Props {
  params: Promise<{ roomId: string }>;
}

export default function CallPage({ params }: Props) {
  const { roomId } = use(params);
  const decodedRoomId = decodeURIComponent(roomId);

  const [tokenData, setTokenData] = useState<TokenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room: decodedRoomId }),
        });
        if (!res.ok) throw new Error("Failed to get token");
        const data: TokenResponse = await res.json();
        setTokenData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get token");
      }
    }

    fetchToken();
  }, [decodedRoomId]);

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Connection Error</h2>
          <p className="mt-1 text-sm text-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
          <p className="text-sm text-muted">Preparing call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <LiveKitRoom
        serverUrl={tokenData.serverUrl}
        token={tokenData.token}
        connect={true}
        audio={true}
        video={false}
        className="flex flex-1 flex-col"
      >
        <RoomAudioRenderer />
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
              <svg
                className="h-12 w-12 text-accent-hover"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold">Voice Call</h1>
            <p className="mt-1 text-sm text-muted font-mono text-xs">
              Room: {decodedRoomId}
            </p>
          </div>

          <CallControls roomId={decodedRoomId} />
        </div>
      </LiveKitRoom>
    </div>
  );
}
