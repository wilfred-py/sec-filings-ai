"use client";

import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
  session?: any;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}
