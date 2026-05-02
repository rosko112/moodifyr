import { getDashboardHistory } from "@/lib/dashboard-data";
import { requireSessionUser } from "@/lib/auth";

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function HistoryPage() {
  const user = await requireSessionUser();
  const moodHistory = await getDashboardHistory(user.id);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h2 className="text-xl font-semibold">Mood History</h2>

      {moodHistory.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
          No mood history yet.
        </div>
      ) : null}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-white/60">
              <th className="px-3 py-2 font-medium">Time</th>
              <th className="px-3 py-2 font-medium">Mood</th>
              <th className="px-3 py-2 font-medium">Input</th>
              <th className="px-3 py-2 font-medium">Suggested songs</th>
            </tr>
          </thead>
          <tbody>
            {moodHistory.map((entry) => (
              <tr key={entry.id} className="border-t border-white/10">
                <td className="px-3 py-3 text-white/75">{formatTime(entry.createdAt)}</td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-emerald-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100">
                    {entry.moodKeyword}
                  </span>
                </td>
                <td className="px-3 py-3 text-white/80">{entry.moodText}</td>
                <td className="px-3 py-3 text-white/80">{entry.tracksCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
