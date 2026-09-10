"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-auth/browser";
import { Button } from "@/components/admin/Button";
import { Input } from "@/components/admin/Input";
import { Alert } from "@/components/admin/Alert";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-sunken px-4">
      <div className="w-full max-w-sm bg-paper-raised border border-border p-8">
        <h1 className="font-display text-2xl text-ink mb-1">BiDev Tech Admin</h1>
        <p className="text-sm text-ink-muted mb-6">Sign in to manage tech.bidev.dev</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@bidev.dev"
            required
            autoFocus
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" loading={loading} className="w-full justify-center">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
