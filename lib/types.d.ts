import type { auth } from "@/lib/auth";

// Better Auth Types
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;

// User Repository Types
export interface UserData {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionData {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

// Auth Service Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
}

export interface AuthSession {
  user: AuthUser;
  session: {
    id: string;
    token: string;
    expiresAt: Date;
    userId: string;
  };
}

// Email Service Types
export interface EmailTemplateProps {
  userFirstName: string;
  verificationUrl?: string;
  resetUrl?: string;
}

export interface EmailServiceParams {
  user: {
    email: string;
    name: string;
    id: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
  };
  url: string;
  token: string;
}

// Better Auth API Response Types
export type BetterAuthSession = {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
} | null;

// JWT Service Types
export interface JWTTokenResponse {
  token: string;
}

export interface JWKSResponse {
  keys: Array<{
    crv: string;
    x: string;
    kty: string;
    kid: string;
  }>;
}
