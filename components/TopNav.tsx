"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AuthState =
  | { status: "loading" }
  | { status: "loggedOut" }
  | { status: "loggedIn"; username?: string };

export default function TopNav() {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
          headers: { "Cache-Control": "no-cache" },
        });

        if (!alive) return;

        if (!res.ok) {
          setAuth({ status: "loggedOut" });
          return;
        }

        const data = await res.json().catch(() => ({}));
        setAuth({ status: "loggedIn", username: data?.user?.username });
      } catch {
        if (!alive) return;
        setAuth({ status: "loggedOut" });
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    window.location.href = "/login";
  }

  if (auth.status === "loading") {
    return (
      <nav className="flex items-center gap-2">
        <span className="rounded-2xl px-3 py-2 text-sm text-slate-500">
          Loading…
        </span>
      </nav>
    );
  }

  if (auth.status === "loggedOut") {
    return (
      <nav className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Sign up
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-2">
      <Link
        href="/dashboard"
        className="rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
      >
        Dashboard
      </Link>

      {auth.username && (
        <Link
          href={`/public/${auth.username}`}
          className="rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Public Profile
        </Link>
      )}

      <button
        onClick={handleLogout}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
      >
        Logout
      </button>
    </nav>
  );
}
