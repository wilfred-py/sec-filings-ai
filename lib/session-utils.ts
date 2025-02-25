import { encodeBase32 } from "@oslojs/encoding";

// Client-safe utilities
export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  return encodeBase32(tokenBytes).toLowerCase();
}
