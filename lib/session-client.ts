import type { SessionValidationResult } from "@/lib/session-server";

export async function getSession(): Promise<SessionValidationResult> {
  const response = await fetch("/api/auth/session");
  if (!response.ok) {
    return { session: null, user: null };
  }
  return response.json();
}
