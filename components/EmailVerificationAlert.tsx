'use client';

import { useState } from 'react';
import { resendVerification } from '@/app/actions/auth';

interface EmailVerificationAlertProps {
  email: string;
}

export default function EmailVerificationAlert({ email }: EmailVerificationAlertProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('');
      
      await resendVerification(email);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-md bg-yellow-50 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          {/* Warning icon */}
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.485 2.495c.873-1.512 3.157-1.512 4.03 0l8.485 14.7c.873 1.512-.218 3.405-2.015 3.405H2.015C.218 20.6-.873 18.707 0 17.195l8.485-14.7zM10 6a.75.75 0 01.75.75v5a.75.75 0 01-1.5 0v-5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Email Verification Required</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Please verify your email address to access all features.</p>
            {message && <p className="text-green-600 mt-2">{message}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="rounded-md bg-yellow-100 px-3 py-2 text-sm font-semibold text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}