export const LIVEKIT_URL = process.env.LIVEKIT_URL || "wss://your-livekit-server.livekit.cloud";

export function generateRoomId(): string {
  return `room-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
