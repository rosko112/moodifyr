import "server-only";

function isLocalOrigin(origin: string) {
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export function getSpotifyRedirectUri(requestUrl: string) {
  const requestOrigin = new URL(requestUrl).origin;
  const configuredRedirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (configuredRedirectUri) {
    const configuredOrigin = new URL(configuredRedirectUri).origin;

    // In local development, prefer the current app origin so OAuth returns
    // to the same host that created the state cookies.
    if (isLocalOrigin(requestOrigin) && !isLocalOrigin(configuredOrigin)) {
      return `${requestOrigin}/api/spotify/callback`;
    }

    return configuredRedirectUri;
  }

  return `${requestOrigin}/api/spotify/callback`;
}
