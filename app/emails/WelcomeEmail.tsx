import { 
  Html,
  Body,
  Container,
  Text,
  Preview,
  Heading,
} from '@react-email/components';

interface WelcomeEmailProps {
  email: string;
}

export default function WelcomeEmail({ email }: WelcomeEmailProps) {
  return (
    <Html>
      <Preview>Welcome to the SEC Filings AI Waitlist</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>Welcome to the SEC Filings AI Waitlist! 🎉</Heading>
          <Text>
            Thanks for signing up to the waitlist. We&apos;re working hard to bring SEC Filings AI to life!
          </Text>
          <Text>
            We&apos;ll notify you as soon as our beta launches with SEC filing summaries delivered straight to your inbox.
          </Text>
          <Text style={{ color: '#666666', marginTop: '24px' }}>
            Best regards,<br />
            Wilfred
          </Text>
        </Container>
      </Body>
    </Html>
  );
} 