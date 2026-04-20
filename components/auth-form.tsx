"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isDatabaseConfigured } from "@/lib/neon";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (!isDatabaseConfigured) {
      setError(
        "Baza še ni nastavljena. Vnesi DATABASE_URL v .env.local.",
      );
      return;
    }

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);
    setError("");

    const response = await fetch(
      mode === "register" ? "/api/auth/register" : "/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const result = (await response.json()) as {
      error?: string;
    };

    setIsSubmitting(false);

    if (!response.ok) {
      setError(result.error ?? "Prišlo je do napake pri prijavi.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          modifyr
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          {mode === "register" ? "Ustvari račun" : "Prijava"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {mode === "register"
            ? "Ustvari račun za dostop do povezave s Spotifyjem in priporočil glede na razpoloženje."
            : "Prijavi se in odkljeni funkcionalnosti, ki so na voljo prijavljenim uporabnikom."}
        </p>
        {!isDatabaseConfigured ? (
          <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Najprej nastavi <code>DATABASE_URL</code> v <code>.env.local</code>.
          </p>
        ) : null}
      </div>

      <form action={handleSubmit} className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          E-pošta
          <input
            name="email"
            type="email"
            required
            placeholder="ime@primer.si"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Geslo
          <input
            name="password"
            type="password"
            minLength={6}
            required
            placeholder="Vsaj 6 znakov"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </label>

        {error ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Počakaj trenutek ..."
            : mode === "register"
              ? "Registriraj se"
              : "Prijavi se"}
        </button>
      </form>

      <div className="mt-6 text-sm text-slate-600">
        {mode === "register" ? "Že imaš račun?" : "Še nimaš računa?"}{" "}
        <Link
          href={mode === "register" ? "/login" : "/register"}
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          {mode === "register" ? "Prijava" : "Registracija"}
        </Link>
      </div>
    </div>
  );
}
