import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { getDefaultUserId } from "@/lib/dashboard-data";

type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
};

type SpotifyMeResponse = {
  id: string;
  display_name: string | null;
};
type ExistsRow = { exists: string | null };

export const runtime = "nodejs";

function redirectToSync(request: Request, queryParam: string) {
  return NextResponse.redirect(new URL(`/dashboard/spotify-sync?${queryParam}`, request.url));
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) return redirectToSync(request, "error=spotify_denied");
    if (!code || !state) return redirectToSync(request, "error=missing_code");

    const cookieStore = await cookies();
    const expectedState = cookieStore.get("moodfyr_spotify_state")?.value;
    const userIdFromCookie = Number(cookieStore.get("moodfyr_user_id")?.value ?? "");
    const userId =
      Number.isInteger(userIdFromCookie) && userIdFromCookie > 0
        ? userIdFromCookie
        : getDefaultUserId();

    if (!expectedState || expectedState !== state) {
      return redirectToSync(request, "error=invalid_state");
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri =
      process.env.SPOTIFY_REDIRECT_URI ??
      `${new URL(request.url).origin}/api/spotify/callback`;

    if (!clientId || !clientSecret) {
      return redirectToSync(request, "error=config");
    }

    const tableCheck = await query<ExistsRow>(
      "SELECT to_regclass('public.spotify_connections') AS exists",
    );
    if (!tableCheck[0]?.exists) {
      return redirectToSync(request, "error=missing_spotify_table");
    }

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      return redirectToSync(request, "error=token_exchange");
    }

    const tokenData = (await tokenResponse.json()) as SpotifyTokenResponse;

    const meResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      cache: "no-store",
    });

    if (!meResponse.ok) {
      return redirectToSync(request, "error=profile_fetch");
    }

    const me = (await meResponse.json()) as SpotifyMeResponse;
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

    await query(
      `INSERT INTO spotify_connections (
         user_id, spotify_user_id, display_name, access_token, refresh_token, token_type, scope, expires_at, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
       ON CONFLICT (user_id)
       DO UPDATE SET
         spotify_user_id = EXCLUDED.spotify_user_id,
         display_name = EXCLUDED.display_name,
         access_token = EXCLUDED.access_token,
         refresh_token = EXCLUDED.refresh_token,
         token_type = EXCLUDED.token_type,
         scope = EXCLUDED.scope,
         expires_at = EXCLUDED.expires_at,
         updated_at = now()`,
      [
        userId,
        me.id,
        me.display_name,
        tokenData.access_token,
        tokenData.refresh_token ?? null,
        tokenData.token_type,
        tokenData.scope,
        expiresAt,
      ],
    );

    const response = redirectToSync(request, "connected=1");
    response.cookies.set("moodfyr_spotify_state", "", { path: "/", maxAge: 0 });
    response.cookies.set("moodfyr_user_id", "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    console.error("Spotify callback failed:", error);
    return redirectToSync(request, "error=internal");
  }
}

