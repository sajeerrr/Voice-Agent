"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

interface Message {
  id: string;
  role: string;
  content: string;
  timestamp: string;
}

interface SessionDetail {
  id: string;
  roomId: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  messages: Message[];
}

interface Props {
  params: Promise<{ id: string }>;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function SessionDetailPage({ params }: Props) {
  const { id } = use(params);
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch(`/api/session/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      }
      setLoading(false);
    }
    fetchSession();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <p className="text-muted">Session not found.</p>
        <Link href="/sessions" className="text-accent-hover hover:underline text-sm mt-2 inline-block">
          Back to Sessions
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link
        href="/sessions"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Sessions
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">Session Transcript</h1>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              session.status === "active"
                ? "bg-green-500/10 text-green-400"
                : "bg-zinc-500/10 text-zinc-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                session.status === "active" ? "bg-green-400 animate-pulse" : "bg-zinc-500"
              }`}
            />
            {session.status}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted">
          <span>Room: <span className="font-mono text-xs">{session.roomId}</span></span>
          <span>Started: {formatTime(session.startedAt)}</span>
          {session.endedAt && <span>Ended: {formatTime(session.endedAt)}</span>}
        </div>
      </div>

      {session.messages.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted">No transcript available for this session.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex flex-col divide-y divide-border">
            {session.messages.map((msg) => (
              <div key={msg.id} className="px-5 py-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-xs font-semibold ${
                      msg.role === "user" ? "text-blue-400" : "text-purple-400"
                    }`}
                  >
                    {msg.role === "user" ? "User" : "Agent"}
                  </span>
                  <span className="text-xs text-muted">
                    {new Date(msg.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
