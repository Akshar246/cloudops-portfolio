"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@cloudops.io");
  const [password, setPassword] = useState("demo123");

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-3xl border p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-gray-600">
            Demo only. Clicking login takes you to the dashboard.
          </p>

          <div className="mt-6 grid gap-3">
            <label className="text-sm font-medium">Email</label>
            <input
              className="rounded-xl border px-4 py-3 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="text-sm font-medium mt-2">Password</label>
            <input
              className="rounded-xl border px-4 py-3 text-sm"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="mt-4 rounded-xl bg-black px-4 py-3 text-sm text-white hover:opacity-90"
              onClick={() => router.push("/dashboard")}
            >
              Login
            </button>

            <button
              className="rounded-xl border px-4 py-3 text-sm hover:bg-gray-50"
              onClick={() => router.push("/")}
            >
              Back to Landing
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
