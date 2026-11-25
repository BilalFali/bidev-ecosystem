import { headers } from "next/headers";

export interface AccessIdentity {
  id: string;
  email: string | null;
}

export function getLocalDevelopmentIdentity(): AccessIdentity | null {
  if (process.env.NODE_ENV !== "development") return null;
  return { id: "local-admin", email: "local@admin.bidev.dev" };
}

export async function getAccessIdentity(): Promise<AccessIdentity | null> {
  const localIdentity = getLocalDevelopmentIdentity();
  if (localIdentity) return localIdentity;

  const requestHeaders = await headers();
  const email = requestHeaders.get("cf-access-authenticated-user-email")?.trim();
  if (!email) return null;

  return { id: email, email };
}

export function getAccessIdentityFromHeaders(requestHeaders: Headers): AccessIdentity | null {
  const email = requestHeaders.get("cf-access-authenticated-user-email")?.trim();
  if (!email) return null;
  return { id: email, email };
}
