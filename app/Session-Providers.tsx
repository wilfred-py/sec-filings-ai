"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
