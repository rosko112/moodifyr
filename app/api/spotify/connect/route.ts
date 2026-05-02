import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentSessionUser } from "@/lib/auth";
import { getSpotifyRedirectUri } from "@/lib/spotify";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto = forwardedProto ?? "https";
  const baseUrl = host ? `${proto}://${host}` : new URL(request.url).origin;

  const user = await getCurrentSessionUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", baseUrl));
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(
      new URL("/dashboard/spotify-sync?error=config", baseUrl),
    );
  }

  const state = randomUUID();
  const redirectUri = getSpotifyRedirectUri({
    requestUrl: request.url,
    forwardedHost: request.headers.get("x-forwarded-host"),
    forwardedProto: request.headers.get("x-forwarded-proto"),
  });

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
  response.cookies.set("moodfyr_user_id", String(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
  return response;
}

