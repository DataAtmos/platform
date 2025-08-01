import type { UserData, SessionData, BetterAuthSession } from "@/lib/types";

export class UserRepository {
  static extractUserFromSession(
    sessionData: BetterAuthSession
  ): UserData | null {
    try {
      if (!sessionData?.user) {
        return null;
      }

      return {
        id: sessionData.user.id,
        email: sessionData.user.email,
        name: sessionData.user.name,
        emailVerified: sessionData.user.emailVerified,
        image: sessionData.user.image,
        createdAt: sessionData.user.createdAt,
        updatedAt: sessionData.user.updatedAt,
      };
    } catch (error) {
      console.error("Error extracting user from session:", error);
      return null;
    }
  }

  static extractSessionFromSession(
    sessionData: BetterAuthSession
  ): SessionData | null {
    try {
      if (!sessionData?.session) {
        return null;
      }

      return {
        id: sessionData.session.id,
        token: sessionData.session.token,
        userId: sessionData.session.userId,
        expiresAt: sessionData.session.expiresAt,
        ipAddress: sessionData.session.ipAddress,
        userAgent: sessionData.session.userAgent,
      };
    } catch (error) {
      console.error("Error extracting session data:", error);
      return null;
    }
  }

  static validateUser(userData: Partial<UserData>): userData is UserData {
    return Boolean(
      userData &&
        typeof userData.id === "string" &&
        typeof userData.email === "string" &&
        typeof userData.name === "string" &&
        typeof userData.emailVerified === "boolean"
    );
  }
}
