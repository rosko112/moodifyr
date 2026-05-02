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
            "The server returned an error while processing authentication.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < 350) {
        await new Promise((resolve) => setTimeout(resolve, 350 - elapsed));
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/6 p-8 text-white shadow-[0_30px_80px_rgba(3,23,13,0.32)] backdrop-blur">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          modifyr
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
          {mode === "register" ? "Create account" : "Login"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/65">
          {mode === "register"
            ? "Create your account to unlock Spotify connection and mood-based recommendations."
            : "Sign in to continue into your mood-powered workspace."}
        </p>
        {!isDatabaseConfigured ? (
          <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/12 px-4 py-3 text-sm text-amber-100">
            Set <code>DATABASE_URL</code> in <code>.env.local</code> or{" "}
            <code>.env</code> first.
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
          <label className="grid gap-2 text-sm font-medium text-white/80">
            Username
            <input
              name="username"
              type="text"
              minLength={3}
              maxLength={32}
              pattern="[a-zA-Z0-9_]+"
              required
              placeholder="your_name"
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-emerald-400 focus:bg-black/30"
            />
          </label>
        ) : null}

        <label className="grid gap-2 text-sm font-medium text-white/80">
          {mode === "register" ? "Email" : "Email or username"}
          <input
            name={mode === "register" ? "email" : "identifier"}
            type={mode === "register" ? "email" : "text"}
            required
            placeholder={
              mode === "register"
                ? "name@example.com"
                : "name@example.com or your_name"
            }
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-emerald-400 focus:bg-black/30"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-white/80">
          Password
          <input
            name="password"
            type="password"
            minLength={6}
            required
            placeholder="At least 6 characters"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-emerald-400 focus:bg-black/30"
          />
        </label>

        {error ? (
          <p className="rounded-2xl border border-rose-300/20 bg-rose-300/12 px-4 py-3 text-sm text-rose-100">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full border-2 border-emerald-200/40 bg-[#1ed760] px-5 py-3 text-sm font-black tracking-wide text-[#03220f] shadow-[0_12px_30px_rgba(30,215,96,0.35)] transition hover:bg-[#25e56b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Please wait..."
            : mode === "register"
              ? "Register"
              : "Login"}
        </button>

        {isSubmitting ? (
          <p className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white/70">
            {mode === "register"
              ? "Creating your account..."
              : "Signing you in..."}
          </p>
        ) : null}
      </form>

      <div className="mt-6 text-sm text-white/65">
        {mode === "register"
          ? "Already have an account?"
          : "Do not have an account yet?"}{" "}
        <Link
          href={mode === "register" ? "/login" : "/register"}
          className="font-semibold text-emerald-300 hover:text-emerald-200"
        >
          {mode === "register" ? "Login" : "Register"}
        </Link>
      </div>
    </div>
  );
}
