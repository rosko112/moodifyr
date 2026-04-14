"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isDatabaseConfigured } from "@/lib/neon";

type SessionUser = {
  id: number;
  email: string;
};

export function AuthStatus() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    if (!isDatabaseConfigured) {
      return;
    }

    let active = true;

    async function loadSession() {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      });
      const data = (await response.json()) as {
        user: SessionUser | null;
      };

      if (active) {
        setUser(data.user);
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
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Dostop do funkcionalnosti
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
          {user
            ? "Pripravljen za uporabo"
            : isDatabaseConfigured
              ? "Za uporabo se prijavi"
              : "Nastavi Neon povezavo"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {user
            ? `Prijavljen si kot ${user.email}. Zdaj lahko uporabljaš zaznavanje razpoloženja in dobiš priporočene pesmi.`
            : isDatabaseConfigured
              ? "Naslovnica je javna, za povezavo s Spotifyjem in uporabo mood priporočil pa potrebuješ račun."
              : "Dodaj DATABASE_URL v .env.local, potem bo login/register takoj deloval."}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {user ? (
            <>
              <Link
                href="/login"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Nadaljuj v aplikacijo
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-950 hover:text-slate-950"
              >
                Odjava
              </button>
            </>
          ) : isDatabaseConfigured ? (
            <>
              <Link
                href="/login"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-950 hover:text-slate-950"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="rounded-full bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800">
              Čaka na tvoje Neon podatke
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Kaj se odklene po prijavi
        </p>
        <div className="mt-5 grid gap-3">
          {[
            ["Spotify povezava", "sinhronizacija profila in poslušalskih navad"],
            ["Vnos počutja", "opis razpoloženja v naravnem jeziku"],
            ["Pametna priporočila", "predlogi pesmi glede na trenutni vibe"],
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
