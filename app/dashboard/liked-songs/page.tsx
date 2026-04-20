const likedSongs = [
  {
    title: "Nights",
    artist: "Frank Ocean",
    album: "Blonde",
    savedAt: "Today, 09:12",
  },
  {
    title: "Tadow",
    artist: "Masego, FKJ",
    album: "Lady Lady",
    savedAt: "Today, 08:44",
  },
  {
    title: "Borderline",
    artist: "Tame Impala",
    album: "The Slow Rush",
    savedAt: "Yesterday, 22:10",
  },
  {
    title: "Something About Us",
    artist: "Daft Punk",
    album: "Discovery",
    savedAt: "Yesterday, 19:02",
  },
];

export default function LikedSongsPage() {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Liked Songs</h2>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-white/60">
              <th className="px-3 py-2 font-medium">Song</th>
              <th className="px-3 py-2 font-medium">Artist</th>
              <th className="px-3 py-2 font-medium">Album</th>
              <th className="px-3 py-2 font-medium">Saved</th>
            </tr>
          </thead>
          <tbody>
            {likedSongs.map((song) => (
              <tr key={song.title} className="border-t border-white/10">
                <td className="px-3 py-3 font-semibold text-white/90">{song.title}</td>
                <td className="px-3 py-3 text-white/80">{song.artist}</td>
                <td className="px-3 py-3 text-white/75">{song.album}</td>
                <td className="px-3 py-3 text-white/70">{song.savedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
