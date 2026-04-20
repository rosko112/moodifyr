const syncItems = [
  { label: "Account", value: "Connected as @moodify-user" },
  { label: "Last sync", value: "2 minutes ago" },
  { label: "Saved tracks", value: "1,284 imported" },
  { label: "Top artists", value: "48 analyzed" },
];

export default function SpotifySyncPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <h2 className="text-xl font-semibold">Spotify Sync Status</h2>
        <div className="mt-4 grid gap-3">
          {syncItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-200/70">
                {item.label}
              </p>
              <p className="mt-2 text-sm text-white/85">{item.value}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <h2 className="text-xl font-semibold">Sync controls</h2>
        <div className="mt-4 grid gap-3">
          <button
            type="button"
            className="rounded-full bg-[#1db954] px-6 py-3 text-sm font-bold text-[#03220f] transition hover:bg-[#25cf61]"
          >
            Start full sync
          </button>
          <button
            type="button"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Refresh liked songs
          </button>
          <button
            type="button"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Reconnect Spotify
          </button>
        </div>
      </article>
    </div>
  );
}
