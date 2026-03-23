"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface EventData {
  id: string;
  title: string;
  description: string;
  type: string;
  maxParticipants: number;
  createdAt: string;
  _count: { participants: number };
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  async function fetchEvents() {
    const res = await fetch("/api/event");
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this event? All participants will also be removed.")) return;
    await fetch(`/api/event/${id}`, { method: "DELETE" });
    fetchEvents();
  }

  function openCreate() {
    setEditingEvent(null);
    setShowModal(true);
  }

  function openEdit(event: EventData) {
    setEditingEvent(event);
    setShowModal(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-sm text-muted mt-1">Manage workshops and competitions</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          + Add Event
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted">No events yet. Create your first event to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    event.type === "workshop"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-purple-500/10 text-purple-400"
                  }`}
                >
                  {event.type}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(event)}
                    className="rounded-md p-1.5 text-muted hover:text-foreground hover:bg-border/50 transition-colors"
                    title="Edit"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="rounded-md p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <Link href={`/events/${event.id}`}>
                <h2 className="text-lg font-semibold mb-1 hover:text-accent-hover transition-colors">
                  {event.title}
                </h2>
              </Link>
              {event.description && (
                <p className="text-sm text-muted mb-3 line-clamp-2">{event.description}</p>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">
                  {event._count.participants} / {event.maxParticipants} seats
                </span>
                <Link
                  href={`/events/${event.id}`}
                  className="text-accent-hover hover:underline text-xs font-medium"
                >
                  View Participants
                </Link>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{
                    width: `${Math.min(100, (event._count.participants / event.maxParticipants) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <EventModal
          event={editingEvent}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
}

function EventModal({
  event,
  onClose,
  onSaved,
}: {
  event: EventData | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [type, setType] = useState(event?.type ?? "workshop");
  const [maxParticipants, setMaxParticipants] = useState(event?.maxParticipants ?? 50);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const body = { title, description, type, maxParticipants };

    if (event) {
      await fetch(`/api/event/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          {event ? "Edit Event" : "Add Event"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Event title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="Event description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="workshop">Workshop</option>
              <option value="competition">Competition</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Max Participants</label>
            <input
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 50)}
              min={1}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {saving ? "Saving..." : event ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
