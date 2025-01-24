import { 
  Html,
  Body,
  Container,
  Text,
  Preview,
  Heading,
} from '@react-email/components';

interface WaitlistEmailProps {
  email: string;
}

export default function WaitlistEmail({ }: WaitlistEmailProps) {
  return (
    <Html>
      <Preview>Welcome to the tldrSEC Waitlist</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>Welcome to the tldrSEC Waitlist! 🎉</Heading>
          <Text>
            Thanks for signing up to the waitlist. We&apos;re working hard to bring this service to life!
          </Text>
          <Text>
            We&apos;ll notify you as soon as our beta launches with SEC filing summaries delivered straight to your inbox.
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