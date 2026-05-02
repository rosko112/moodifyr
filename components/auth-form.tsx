"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type AuthFormProps = {
  mode: "login" | "register";
  isDatabaseConfigured: boolean;
  initialError?: string;
};

export function AuthForm({ mode, isDatabaseConfigured, initialError }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState(initialError ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!isDatabaseConfigured) {
      setError("Database connection is not configured yet.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const identifier = String(
      formData.get(mode === "register" ? "email" : "identifier") ?? "",
    );
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    const startedAt = Date.now();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        mode === "register" ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            mode === "register"
              ? { email: identifier, username, password }
              : { identifier, password },
          ),
        },
      );

      const rawBody = await response.text();
      let result: { error?: string } = {};

      if (rawBody) {
        try {
          result = JSON.parse(rawBody) as { error?: string };
        } catch {
          result = {};
        }
      }

      if (!response.ok) {
        setError(
          result.error ??
            "Streznik je vrnil napako pri prijavi oziroma registraciji.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Povezava s streznikom ni uspela.");
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < 350) {
        await new Promise((resolve) => setTimeout(resolve, 350 - elapsed));
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          modifyr
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          {mode === "register" ? "Ustvari racun" : "Prijava"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {mode === "register"
            ? "Ustvari racun za dostop do povezave s Spotifyjem in priporocil glede na razpolozenje."
            : "Prijavi se in odkleni funkcionalnosti, ki so na voljo prijavljenim uporabnikom."}
        </p>
        {!isDatabaseConfigured ? (
          <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Najprej nastavi <code>DATABASE_URL</code> v <code>.env.local</code>{" "}
            ali <code>.env</code>.
          </p>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        action={mode === "register" ? "/api/auth/register" : "/api/auth/login"}
        method="post"
        className="grid gap-4"
      >
        {mode === "register" ? (
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Username
            <input
              name="username"
              type="text"
              minLength={3}
              maxLength={32}
              pattern="[a-zA-Z0-9_]+"
              required
              placeholder="your_name"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </label>
        ) : null}

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          {mode === "register" ? "E-posta" : "Email or username"}
          <input
            name={mode === "register" ? "email" : "identifier"}
            type={mode === "register" ? "email" : "text"}
            required
            placeholder={mode === "register" ? "name@example.com" : "name@example.com or your_name"}
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
            ? "Pocakaj trenutek ..."
            : mode === "register"
              ? "Registriraj se"
              : "Prijavi se"}
        </button>

        {isSubmitting ? (
          <p className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white/70">
            {mode === "register"
              ? "Creating your account..."
              : "Signing you in..."}
          </p>
        ) : null}
      </form>

      <div className="mt-6 text-sm text-slate-600">
        {mode === "register" ? "Ze imas racun?" : "Se nimas racuna?"}{" "}
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
