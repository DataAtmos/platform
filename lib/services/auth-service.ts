import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserRepository } from "@/lib/repositories/user-repository";
import type { AuthSession, BetterAuthSession, UserData } from "@/lib/types";

export class AuthService {
  static async getSession(): Promise<AuthSession | null> {
    try {
      const headersList = await headers();
      const headersObject: Record<string, string> = {};
      headersList.forEach((value, key) => {
        headersObject[key] = value;
      });

      const session = (await auth.api.getSession({
        headers: new Headers(headersObject),
      })) as BetterAuthSession;

      if (!session?.user || !session?.session) {
        return null;
      }

      return {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          emailVerified: session.user.emailVerified,
          image: session.user.image,
        },
        session: {
          id: session.session.id,
          token: session.session.token,
          expiresAt: session.session.expiresAt,
          userId: session.session.userId,
        },
      };
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  }

  static async requireAuth(): Promise<AuthSession> {
    const session = await this.getSession();
    if (!session) {
      redirect("/auth/signin");
    }
    return session;
  }

  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }

  static async getUserFromSession(): Promise<UserData | null> {
    try {
      const headersList = await headers();
      const headersObject: Record<string, string> = {};
      headersList.forEach((value, key) => {
        headersObject[key] = value;
      });

      const session = (await auth.api.getSession({
        headers: new Headers(headersObject),
      })) as BetterAuthSession;

      return UserRepository.extractUserFromSession(session);
    } catch (error) {
      console.error("Error getting user from session:", error);
      return null;
    }
  }

  static async signOut(): Promise<void> {
    try {
      const headersList = await headers();
      const headersObject: Record<string, string> = {};
      headersList.forEach((value, key) => {
        headersObject[key] = value;
      });

      await auth.api.signOut({
        headers: new Headers(headersObject),
      });

      redirect("/");
    } catch (error) {
      console.error("Error signing out:", error);
      throw new Error("Failed to sign out");
    }
  }

  static async verifyEmail(token: string): Promise<boolean> {
    try {
      const result = await auth.api.verifyEmail({
        query: { token },
      });
      return Boolean(result);
    } catch (error) {
      console.error("Error verifying email:", error);
      throw new Error("Failed to verify email");
    }
  }
}
