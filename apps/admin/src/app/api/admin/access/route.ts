import { NextResponse } from "next/server";
import { getAccessIdentity } from "@/lib/cloudflare-access";

export async function GET() {
  const identity = await getAccessIdentity();
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ email: identity.email });
}
