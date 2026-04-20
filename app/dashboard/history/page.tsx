const moodHistory = [
  { time: "08:12", mood: "focused", detail: "deep work block", tracks: 14 },
  { time: "11:40", mood: "uplift", detail: "post-meeting reset", tracks: 9 },
  { time: "15:05", mood: "calm", detail: "light afternoon", tracks: 11 },
  { time: "20:18", mood: "reflective", detail: "evening walk", tracks: 13 },
];

export default function HistoryPage() {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h2 className="text-xl font-semibold">Mood History</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-white/60">
              <th className="px-3 py-2 font-medium">Time</th>
              <th className="px-3 py-2 font-medium">Mood</th>
              <th className="px-3 py-2 font-medium">Context</th>
              <th className="px-3 py-2 font-medium">Suggested songs</th>
            </tr>
          </thead>
          <tbody>
            {moodHistory.map((entry) => (
              <tr key={`${entry.time}-${entry.mood}`} className="border-t border-white/10">
                <td className="px-3 py-3 text-white/75">{entry.time}</td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-emerald-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100">
                    {entry.mood}
                  </span>
                </td>
                <td className="px-3 py-3 text-white/80">{entry.detail}</td>
                <td className="px-3 py-3 text-white/80">{entry.tracks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
