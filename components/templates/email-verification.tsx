import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface EmailVerificationTemplateProps {
  userFirstName: string
  verificationUrl: string
}

export const EmailVerificationTemplate = ({ userFirstName, verificationUrl }: EmailVerificationTemplateProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address to complete your Data Atmos account setup</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://dataatmos.ai/logo-white.svg" width="60" height="60" alt="Data Atmos" style={logo} />
        <Heading style={h1}>Verify your email address</Heading>
        <Text style={text}>Hi {userFirstName},</Text>
        <Text style={text}>
          Thank you for creating an account with Data Atmos. To complete your account setup, please verify your email
          address by clicking the button below:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={verificationUrl}>
            Verify Email Address
          </Button>
        </Section>
        <Text style={text}>If you&apos;re unable to click the button above, copy and paste this URL into your browser:</Text>
        <Link href={verificationUrl} style={link}>
          {verificationUrl}
        </Link>
        <Text style={footer}>If you didn&apos;t create an account with Data Atmos, you can safely ignore this email.</Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: "#0d1117",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
  backgroundColor: "#161b22",
  borderRadius: "6px",
  border: "1px solid #30363d",
}

const logo = {
  margin: "0 auto",
  display: "block",
}

const h1 = {
  color: "#f0f6fc",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
}

const text = {
  color: "#e6edf3",
  fontSize: "14px",
  lineHeight: "26px",
  margin: "16px 24px",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#238636",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "0 24px",
  border: "1px solid #2ea043",
}

const link = {
  color: "#58a6ff",
  fontSize: "14px",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
  margin: "0 24px",
  display: "block",
}

const footer = {
  color: "#8b949e",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "24px",
  margin: "24px 24px 0",
}
