"use client";

import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
  session?: any;
}

export function Providers({ children, session }: ProvidersProps) {
  console.log(`Session: ${session}`);
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
