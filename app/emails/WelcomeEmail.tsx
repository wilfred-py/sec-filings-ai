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
          <Heading>Welcome to SEC Filings AI! 🎉</Heading>
          <Text>
            Thanks for sigining up to our waitlist. I'm excited to share SEC Filings AI with you!
          </Text>
          <Text>
            We'll notify you as soon as our beta launches with AI-powered SEC filing summaries delivered straight to your inbox.
          </Text>
          <Text style={{ color: '#666666', marginTop: '24px' }}>
            Best regards,<br />
            Wilf
          </Text>
        </Container>
      </Body>
    </Html>
  );
} 