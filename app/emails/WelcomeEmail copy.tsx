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
  token: string;
}

export default function WelcomeEmail({ email, token }: WelcomeEmailProps) {
  return (
    <Html>
      <Preview>Welcome to the tldrSEC</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>Welcome to tldrSEC! 🎉</Heading>
          <Text>
            We&apos;re excited to share our SEC filing summaries with you!
          </Text>
          <Text>
            Please click on the below link to confirm your email address.
            <a href={`https://tldrsec.com/confirm-email?token=${token}`}>Confirm Email</a>
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