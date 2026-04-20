const moodChips = ["calm", "focused", "warm", "night drive", "optimistic"];

export default function MoodInputPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Mood Input</h2>
          <span className="rounded-full bg-emerald-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
            AI ready
          </span>
        </div>
        <label className="mt-4 block text-sm text-white/75" htmlFor="mood">
          Describe how you feel right now
        </label>
        <textarea
          id="mood"
          rows={7}
          className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#1db954] focus:outline-none"
          placeholder="Example: I am a bit tired but want warm songs for an evening walk."
          defaultValue="Calm but motivated. Need warm songs with steady tempo for focused work."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {moodChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full bg-[#1db954] px-6 py-3 text-sm font-bold text-[#03220f] transition hover:bg-[#25cf61]"
          >
            Generate songs
          </button>
          <button
            type="button"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Save preset
          </button>
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <h2 className="text-xl font-semibold">Prompt examples</h2>
        <div className="mt-4 grid gap-3">
          {[
            "Need soft tracks for evening coding.",
            "I feel upbeat and want dance pop with high energy.",
            "Rainy day mood, give me mellow indie tracks.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80"
            >
              {item}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
