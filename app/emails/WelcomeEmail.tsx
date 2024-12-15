import { 
  Html,
  Body,
  Container,
  Text,
  Link,
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
            Thanks for sigining up to the waitlist. We're working hard to bring SEC Filings AI to life!
          </Text>
          <Text>
            We'll notify you as soon as our beta launches with SEC filing summaries delivered straight to your inbox.
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