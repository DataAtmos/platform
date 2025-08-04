import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileContent from "@/components/profile/profile-content";

export default async function ProfilePage() {
  const [session, activeSessions] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    auth.api.listSessions({
      headers: await headers(),
    }),
  ]).catch((e) => {
    console.log(e);
    throw redirect("/auth/signin");
  });

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="w-full px-5 pt-5">
      <ProfileContent
        session={JSON.parse(JSON.stringify(session))}
        activeSessions={JSON.parse(JSON.stringify(activeSessions))}
      />
    </div>
  );
}