import "server-only";

function isLocalOrigin(origin: string) {
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

type RedirectOriginOptions = {
  requestUrl: string;
  forwardedHost?: string | null;
  forwardedProto?: string | null;
};

function getRequestOrigin({ requestUrl, forwardedHost, forwardedProto }: RedirectOriginOptions) {
  const originUrl = new URL(requestUrl);
  if (forwardedHost) {
    const proto = forwardedProto ?? "https";
    return `${proto}://${forwardedHost}`;
  }

  return originUrl.origin;
}

export function getSpotifyRedirectUri(options: RedirectOriginOptions) {
  const requestOrigin = getRequestOrigin(options);
  const configuredRedirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (configuredRedirectUri) {
    return configuredRedirectUri;
  }

  return `${requestOrigin}/api/spotify/callback`;
}
