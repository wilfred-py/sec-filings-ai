import { redirect } from "next/navigation";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/lib/session";

export default async function Dashboard() {
  const { session, user } = await getCurrentSession();
  if (session === null || user === null) {
    return redirect("/login");
  }
  return (
    <div>
      <div>Dashboard</div>
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}

async function logout(formData: FormData): Promise<void> {
  "use server";
  const { session } = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  await invalidateSession(session.id);
  await deleteSessionTokenCookie();
  redirect("/login");
}

interface ActionResult {
  error: string | null;
}
