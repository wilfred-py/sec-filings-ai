export const resendVerification = async (email: string) => {
  const response = await fetch('/api/auth/resend-verification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return response.json();
}; 