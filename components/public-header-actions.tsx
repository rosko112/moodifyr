"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "@/app/dashboard/_components/logout-button";

type SessionUser = {
  id: number;
  email: string;
  username: string;
};

export function PublicHeaderActions() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const data = (await response.json()) as {
          user: SessionUser | null;
        };

        if (active) {
          setUser(data.user);
          setHasLoaded(true);
        }
      } catch {
        if (active) {
          setHasLoaded(true);
        }
      }
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, []);

  if (!hasLoaded) {
    return (
      <div className="rounded-full bg-white/8 px-5 py-3 text-sm font-semibold text-white/70">
        Loading session
      </div>
    );
  }

  if (user) {
    return (
      <>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full border-2 border-emerald-200/40 bg-[#1ed760] px-6 py-3 text-sm font-black tracking-wide text-[#03220f] shadow-[0_12px_30px_rgba(30,215,96,0.35)] transition hover:bg-[#25e56b]"
        >
          Back to dashboard
        </Link>
        <LogoutButton />
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/45 hover:bg-white/10"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="inline-flex items-center justify-center rounded-full border-2 border-emerald-200/40 bg-[#1ed760] px-6 py-3 text-sm font-black tracking-wide text-[#03220f] shadow-[0_12px_30px_rgba(30,215,96,0.35)] transition hover:bg-[#25e56b]"
      >
        Register
      </Link>
    </>
  );
}
