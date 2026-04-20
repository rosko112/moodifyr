"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 grid gap-2 text-sm">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-2xl px-4 py-3 transition ${
              active
                ? "bg-[#1db954] font-semibold text-[#03220f]"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
