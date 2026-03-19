export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

let didLogMissingOAuthPortalConfig = false;

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  if (!oauthPortalUrl || !appId) {
    if (!didLogMissingOAuthPortalConfig) {
      didLogMissingOAuthPortalConfig = true;
      console.warn(
        "[OAuth] Login URL unavailable. Set VITE_OAUTH_PORTAL_URL and VITE_APP_ID."
      );
    }
    return null;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL("/app-auth", oauthPortalUrl);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
