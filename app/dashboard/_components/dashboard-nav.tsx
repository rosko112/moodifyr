"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Mood Input", href: "/dashboard/mood-input" },
  { label: "Liked Songs", href: "/dashboard/liked-songs" },
  { label: "History", href: "/dashboard/history" },
  { label: "Spotify Sync", href: "/dashboard/spotify-sync" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 grid gap-2 text-sm">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-2xl px-4 py-3 text-left transition ${
              isActive
                ? "bg-[#1db954] font-semibold text-[#03220f]"
                : "bg-white/0 text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
