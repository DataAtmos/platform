import { headers } from "next/headers";

export class JWTService {
  static async getJWTToken(): Promise<string | null> {
    try {
      const headersList = await headers();
      const headersObject: Record<string, string> = {};
      headersList.forEach((value, key) => {
        headersObject[key] = value;
      });

      // Use the /token endpoint directly as per JWT plugin docs
      const response = await fetch("/api/auth/token", {
        headers: headersObject,
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        return data.token as string;
      }

      return null;
    } catch (error) {
      console.error("Error getting JWT token:", error);
      return null;
    }
  }

  static async getJWKS(): Promise<Record<string, unknown>> {
    try {
      // Use the /jwks endpoint directly as per JWT plugin docs
      const response = await fetch("/api/auth/jwks", {
        method: "GET",
      });

      if (response.ok) {
        return await response.json();
      }

      throw new Error(`JWKS request failed: ${response.status}`);
    } catch (error) {
      console.error("Error getting JWKS:", error);
      throw new Error("Failed to get JWKS");
    }
  }
}
