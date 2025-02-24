"use server";

import { redirect } from "next/navigation";
import {
  getCurrentSession,
  invalidateSession,
  deleteSessionTokenCookie,
} from "@/lib/session";

export async function logout(): Promise<void> {
  const { session } = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  await invalidateSession(session.id);
  await deleteSessionTokenCookie();
  redirect("/login");
}
