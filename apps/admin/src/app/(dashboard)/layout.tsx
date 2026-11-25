import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { getAccessIdentity } from "@/lib/cloudflare-access";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let email: string | null = null;

  await createClient();
  const identity = await getAccessIdentity();
  if (!identity) redirect("/");
  email = identity.email;

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar email={email} />
      <div className="flex-1 flex flex-col overflow-hidden ml-[220px]">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
