import { createClient } from "@/lib/supabase-auth/server";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-paper">
      <Sidebar email={user?.email} />
      <div className="pl-[220px]">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
