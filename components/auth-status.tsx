"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SessionUser = {
  id: number;
  email: string;
  username: string;
};

export function AuthStatus() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isDatabaseConfigured, setIsDatabaseConfigured] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      });

      const data = (await response.json()) as {
        configured: boolean;
        user: SessionUser | null;
      };

      if (active) {
        setIsDatabaseConfigured(Boolean(data.configured));
        setUser(data.user);
        setHasLoaded(true);
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    setUser(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Feature access
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
          {!hasLoaded
            ? "Checking connection"
            : user
              ? "Ready to use"
              : isDatabaseConfigured
                ? "Sign in to continue"
                : "Set up your Neon connection"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/68">
          {!hasLoaded
            ? "Checking whether the database is ready and whether an active session already exists."
            : user
              ? `Signed in as @${user.username} (${user.email}). Dashboard, Spotify sync, and mood features are unlocked.`
              : isDatabaseConfigured
                ? "The landing page is public, but Spotify connection and mood recommendations require an account."
                : "Add DATABASE_URL to .env.local or .env and login/register will work immediately."}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border-2 border-emerald-200/40 bg-[#1ed760] px-5 py-3 text-sm font-black tracking-wide text-[#03220f] shadow-[0_12px_30px_rgba(30,215,96,0.35)] transition hover:bg-[#25e56b]"
              >
                Continue to dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/45 hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : hasLoaded && isDatabaseConfigured ? (
            <>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border-2 border-emerald-200/40 bg-[#1ed760] px-5 py-3 text-sm font-black tracking-wide text-[#03220f] shadow-[0_12px_30px_rgba(30,215,96,0.35)] transition hover:bg-[#25e56b]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/45 hover:bg-white/10"
              >
                Register
              </Link>
            </>
          ) : hasLoaded ? (
            <div className="rounded-full bg-amber-300/14 px-5 py-3 text-sm font-semibold text-amber-100">
              Waiting for your Neon credentials
            </div>
          ) : (
            <div className="rounded-full bg-white/8 px-5 py-3 text-sm font-semibold text-white/70">
              Loading sign-in state
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-white backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
          What unlocks after login
        </p>
        <div className="mt-5 grid gap-3">
          {[
            ["Spotify connection", "sync your profile and listening habits"],
            ["Mood input", "describe how you feel in natural language"],
            ["Smart recommendations", "get song picks based on your current vibe"],
          ].map(([title, copy]) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-white/5 p-4"
            >
              <p className="font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm leading-6 text-white/65">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
