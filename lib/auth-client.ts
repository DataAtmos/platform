import { createAuthClient } from "better-auth/react";
import {
  twoFactorClient,
  multiSessionClient,
  passkeyClient,
  adminClient,
} from "better-auth/client/plugins";

export const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/auth/two-factor";
      },
    }),
    multiSessionClient(),
    passkeyClient(),
    adminClient(),
  ],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        console.error("Too many requests. Please try again later.");
      }
    },
    onSuccess(ctx) {
      // Store bearer token for API access if present
      const bearerToken = ctx.response.headers.get("set-auth-token");
      if (bearerToken) {
        localStorage.setItem("auth-token", bearerToken);
      }
    },
  },
});

export const {
  signUp,
  signIn,
  signOut,
  useSession,
  getSession,
  passkey,
  useListPasskeys,
} = client;

export const authClient = client;
