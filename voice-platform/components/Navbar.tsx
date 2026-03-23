"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const navLinks = [
    { href: "/events", label: "Events" },
    { href: "/sessions", label: "Sessions" },
  ];

  async function handleNewCall() {
    setLoading(true);
    try {
      const res = await fetch("/api/session", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create session");
      const session = await res.json();
      router.push(`/call/${encodeURIComponent(session.roomId)}`);
    } catch (err) {
      console.error("Failed to start call:", err);
      setLoading(false);
    }
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/events" className="text-lg font-bold tracking-tight text-foreground">
            Hestia Voice AI
          </Link>
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  pathname.startsWith(link.href)
                    ? "bg-accent/10 text-accent-hover"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <button
          onClick={handleNewCall}
          disabled={loading}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Starting..." : "Try New Call"}
        </button>
      </div>
    </nav>
  );
}
