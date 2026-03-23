"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SessionData {
  id: string;
  roomId: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
}

function formatDuration(startedAt: string, endedAt: string | null): string {
  if (!endedAt) return "Ongoing";
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
  const diffMs = end - start;
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      const res = await fetch("/api/session");
      const data = await res.json();
      setSessions(data);
      setLoading(false);
    }
    fetchSessions();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <p className="text-sm text-muted mt-1">Voice call session history</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted">No sessions yet. Click &quot;Try New Call&quot; to start one.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="px-4 py-3 text-left font-medium text-muted">Session ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Started</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Duration</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-border last:border-0 hover:bg-card-hover transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs">{session.id.slice(0, 8)}...</span>
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3 text-muted">{formatTime(session.startedAt)}</td>
                  <td className="px-4 py-3 text-muted">
                    {formatDuration(session.startedAt, session.endedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/sessions/${session.id}`}
                      className="text-accent-hover hover:underline text-xs font-medium"
                    >
                      View Transcript
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
