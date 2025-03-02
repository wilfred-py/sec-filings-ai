import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { Session, ISession } from "@/app/models/Session";
import { IUser } from "@/app/models/User";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

// Server-only functions
export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session = await Session.findOne({ id: sessionId }).populate("userId");

  if (!session) {
    return { session: null, user: null };
  }

  const user = session.userId as unknown as IUser;

  if (Date.now() >= session.expiresAt.getTime()) {
    await Session.deleteOne({ id: session.id });
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await session.save();
  }

  return {
    session: {
      id: session.id,
      userId: user.id,
      expiresAt: session.expiresAt,
    },
    user,
  };
}

export async function getCurrentSession(): Promise<SessionValidationResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;
  if (token === null) {
    return { session: null, user: null };
  }
  return await validateSessionToken(token);
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await Session.deleteOne({ id: sessionId });
}

export async function createSession(
  token: string,
  userId: mongoose.Types.ObjectId,
): Promise<ISession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session = new Session({
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
  await session.save();
  return session;
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const cookiesStore = await cookies();
  cookiesStore.set("session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookiesStore = await cookies();
  cookiesStore.set("session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export async function getSession(
  req: NextRequest,
): Promise<SessionValidationResult> {
  const token = req.cookies.get("session")?.value ?? null;
  if (token === null) {
    return { session: null, user: null };
  }
  return await validateSessionToken(token);
}

export type SessionValidationResult =
  | { session: Pick<ISession, "id" | "expiresAt" | "userId">; user: IUser }
  | { session: null; user: null };
