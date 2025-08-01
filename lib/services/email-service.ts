import { Resend } from "resend";
import { EmailVerificationTemplate } from "@/components/templates/email-verification";
import { PasswordResetTemplate } from "@/components/templates/password-reset";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async ({
  user,
  url,
}: {
  user: { email: string; name: string };
  url: string;
  token: string;
}) => {
  const emailHtml = await render(
    EmailVerificationTemplate({
      userFirstName: user.name || "User",
      verificationUrl: url,
    })
  );

  const { data, error } = await resend.emails.send({
    from: "Data Atmos <noreply@dataatmos.ai>",
    to: [user.email],
    subject: "Verify your email address",
    html: emailHtml,
  });

  if (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }

  console.log("Verification email sent:", data?.id);
};

export const sendPasswordResetEmail = async ({
  user,
  url,
}: {
  user: { email: string; name: string };
  url: string;
  token: string;
}) => {
  const emailHtml = await render(
    PasswordResetTemplate({
      userFirstName: user.name || "User",
      resetUrl: url,
    })
  );

  const { data, error } = await resend.emails.send({
    from: "Data Atmos <noreply@dataatmos.ai>",
    to: [user.email],
    subject: "Reset your password",
    html: emailHtml,
  });

  if (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }

  console.log("Password reset email sent:", data?.id);
};

export const sendOTPEmail = async ({
  user,
  otp,
}: {
  user: { email: string; name: string };
  otp: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: "Data Atmos <noreply@dataatmos.ai>",
    to: [user.email],
    subject: "Your 2FA verification code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Your verification code</h2>
        <p>Hi ${user.name || "User"},</p>
        <p>Your 2FA verification code is:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }

  console.log("OTP email sent:", data?.id);
};
