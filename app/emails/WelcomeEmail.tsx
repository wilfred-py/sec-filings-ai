import {
  Html,
  Body,
  Container,
  Text,
  Preview,
  Heading,
} from "@react-email/components";

interface WelcomeEmailProps {
  token: string;
  baseUrl?: string;
}

export default function WelcomeEmail({ token, baseUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Preview>Welcome to the tldrSEC</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "sans-serif" }}>
        <Container>
          <Heading>Welcome to tldrSEC! 🎉</Heading>
          <Text>
            We&apos;re excited to share our SEC filing summaries with you!
          </Text>
          <Text>
            Please click on the below link to confirm your email address.
          </Text>
          <Text>
            <a href={`${baseUrl}/api/auth/verify-email?token=${token}`}>
              Confirm Email
            </a>
          </Text>
          <Text style={{ color: "#666666", marginTop: "24px" }}>
            Best regards,
            <br />
            Wilf
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
