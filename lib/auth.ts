import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";
import { nextCookies } from "better-auth/next-js";
import {
  bearer,
  admin,
  multiSession,
  twoFactor,
  jwt,
  openAPI,
} from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { MysqlDialect } from "kysely";

const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "atmos",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const mysql = new MysqlDialect(pool);

export const auth = betterAuth({
  appName: "Data Atmos Platform",
  database: {
    dialect: mysql,
    type: "mysql",
  },

  plugins: [
    nextCookies(),
    bearer(), // Add bearer plugin for JWT API access
    openAPI(), // Add OpenAPI plugin for API documentation
    jwt(), // JWT plugin for token generation
    admin({
      // Add admin plugin - you can set admin user IDs here
      adminUserIds: [], // Add admin user IDs when needed
    }),
    twoFactor({
      issuer: "Data Atmos",
      totpOptions: {
        period: 30,
      },
      otpOptions: {
        async sendOTP({ user, otp }) {
          const { sendOTPEmail } = await import("./services/email-service");
          await sendOTPEmail({ user, otp });
        },
      },
    }),
    multiSession(),
    passkey({
      rpID:
        process.env.NODE_ENV === "production"
          ? process.env.PASSKEY_RP_ID || "localhost"
          : "localhost",
      rpName: "Data Atmos",
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.BETTER_AUTH_URL || "http://localhost:3000"
          : "http://localhost:3000",
    }),
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url, token }) => {
      const { sendPasswordResetEmail } = await import(
        "./services/email-service"
      );
      await sendPasswordResetEmail({ user, url, token });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      // Import here to avoid circular dependency
      const { sendVerificationEmail } = await import(
        "./services/email-service"
      );
      await sendVerificationEmail({ user, url, token });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24, // 24 hours
    updateAge: 60 * 60 * 24, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 24 hours
    },
  },

  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
});
