import { redirect } from "next/navigation";
import { getCurrentSessionUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await getCurrentSessionUser();

  if (!user) redirect("/login");

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-black/20 p-6 backdrop-blur">

        <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/70">
          profile
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight">
          {user.username}
        </h1>

        <p className="mt-2 text-white/60">
          Your account and identity inside moodfyr
        </p>

      </section>

      {/* INFO GRID */}
      <section className="grid gap-6 md:grid-cols-2">

        {/* ACCOUNT INFO */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-lg font-semibold">Account details</h2>

          <div className="mt-5 space-y-4 text-sm">

            <div className="flex items-center justify-between">
              <span className="text-white/50">User ID</span>
              <span className="text-white/80">{user.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/50">Email</span>
              <span className="text-white/80">{user.email}</span>
            </div>

          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">

          <h2 className="text-lg font-semibold">System status</h2>

          <div className="mt-5 space-y-3 text-sm">

            <div className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
              <span className="text-white/60">Spotify connection</span>
              <span className="text-emerald-300">Active</span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
              <span className="text-white/60">Mood engine</span>
              <span className="text-emerald-300">Online</span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
              <span className="text-white/60">Recommendation model</span>
              <span className="text-emerald-300">Ready</span>
            </div>

          </div>
        </div>

      </section>

      {/* ACTION SECTION */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">

        <h2 className="text-lg font-semibold">Account actions</h2>

        <p className="mt-2 text-sm text-white/60">
          Manage your moodfyr experience and data.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">

          <button className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 hover:border-[#1db954] hover:bg-white/10 transition">
            Edit profile settings
          </button>

          <button className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 hover:border-[#1db954] hover:bg-white/10 transition">
            Export my data
          </button>

          <button className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 transition">
            Delete account
          </button>

          <button className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 hover:border-[#1db954] hover:bg-white/10 transition">
            Disconnect Spotify
          </button>

        </div>

      </section>

    </div>
  );
}