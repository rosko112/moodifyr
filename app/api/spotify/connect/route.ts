import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getDefaultUserId } from "@/lib/dashboard-data";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
export const runtime = "nodejs";

function getUserId(req: Request) {
  const url = new URL(req.url);
  const fromQuery = Number(url.searchParams.get("userId"));
  if (Number.isInteger(fromQuery) && fromQuery > 0) return fromQuery;

  const fromHeader = Number(req.headers.get("x-user-id"));
  if (Number.isInteger(fromHeader) && fromHeader > 0) return fromHeader;

  return getDefaultUserId();
}

export async function GET(request: Request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL("/dashboard/spotify-sync?error=config", request.url));
  }

  const userId = getUserId(request);
  const state = randomUUID();
  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI ??
    `${new URL(request.url).origin}/api/spotify/callback`;

  const authUrl = new URL(SPOTIFY_AUTH_URL);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set(
    "scope",
    [
      "user-read-email",
      "user-read-private",
      "user-library-read",
      "playlist-read-private",
      "playlist-read-collaborative",
    ].join(" "),
  );
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("show_dialog", "true");

  const response = NextResponse.redirect(authUrl);
  response.cookies.set("moodfyr_spotify_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
  response.cookies.set("moodfyr_user_id", String(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
  return response;
}

