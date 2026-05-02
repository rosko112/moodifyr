import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "modifyr | Mood-based Spotify recommendations",
  description:
<<<<<<< Updated upstream
    "Connect Spotify, describe your mood, and discover songs that match your current vibe.",
=======
<<<<<<< Updated upstream
    "Poveži Spotify, opiši svoje razpoloženje in odkrij pesmi, ki se ujemajo s tvojim trenutnim vibeom.",
=======
    "Connect Spotify, describe your mood, and discover songs that match your current vibe.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
>>>>>>> Stashed changes
>>>>>>> Stashed changes
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
