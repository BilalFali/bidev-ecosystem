import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let email: string | null = null;

  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      redirect("/login");
    }

    email = user.email ?? null;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    // Missing env vars — show a setup screen instead of a blank 500
    if (msg.includes("Missing required environment variable")) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-bg-elevated border border-red-500/20 rounded-2xl p-6">
            <h1 className="text-lg font-bold text-red-400 mb-2">Configuration Error</h1>
            <p className="text-sm text-ink-muted mb-4">
              The following environment variables are not set in your Vercel project:
            </p>
            <ul className="space-y-1 text-sm font-mono text-ink bg-bg-card rounded-lg p-4 border border-border">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>SUPABASE_SERVICE_ROLE_KEY</li>
            </ul>
            <p className="text-xs text-ink-faint mt-4">
              Add them in Vercel → Project Settings → Environment Variables, then redeploy.
            </p>
          </div>
        </div>
      );
    }

    redirect("/login");
  }

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
