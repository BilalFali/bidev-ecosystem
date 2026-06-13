"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Column,
  Heading,
  Text,
  Button,
  Input,
  Flex,
} from "@/once-ui/components";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!supabase) {
        setError("Authentication service is not configured");
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column maxWidth="xs" fillWidth gap="l" paddingY="xl">
      <Column gap="m" fillWidth>
        <Heading variant="display-strong-l">Login</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          Access your blog dashboard
        </Text>
      </Column>

      <form onSubmit={handleLogin} style={{ width: "100%" }}>
        <Column gap="m" fillWidth>
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <Text
              variant="body-default-s"
              style={{ color: "var(--static-red)" }}
            >
              {error}
            </Text>
          )}

          <Button
            type="submit"
            variant="primary"
            size="l"
            fillWidth
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Column>
      </form>
    </Column>
  );
}
