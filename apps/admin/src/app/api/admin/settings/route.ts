import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getD1 } from "@/lib/d1";

const ALLOWED_KEYS = new Set(["auto_approve_comments", "announcement_banner"]);
const BANNER_KEY = "announcement_banner";

function isSafeBannerUrl(value: string) {
  if (!value || value !== value.trim() || /[\u0000-\u001f\u007f\\]/.test(value)) {
    return false;
  }
  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validateSetting(key: string, value: unknown): string | null {
  if (typeof value !== "string") return "Setting values must be strings.";

  if (key === "auto_approve_comments") {
    return value === "true" || value === "false" ? null : "Invalid comment setting.";
  }

  if (key === BANNER_KEY) {
    try {
      const banner = JSON.parse(value) as {
        enabled?: unknown;
        text?: unknown;
        url?: unknown;
      };

      if (
        typeof banner.enabled !== "boolean" ||
        typeof banner.text !== "string" ||
        typeof banner.url !== "string" ||
        banner.text.length > 180 ||
        banner.url.length > 2048
      ) {
        return "Invalid announcement banner settings.";
      }
      if (banner.enabled && (!banner.text.trim() || !isSafeBannerUrl(banner.url))) {
        return "An enabled banner needs text and a valid HTTP(S) or site-relative URL.";
      }

      return null;
    } catch {
      return "Announcement banner settings must be valid JSON.";
    }
  }

  return "Unknown setting.";
}

// GET /api/admin/settings?keys=key1,key2
export async function GET(req: NextRequest) {
  const authClient = await createClient();
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requestedKeys = req.nextUrl.searchParams.get("keys")?.split(",").filter(Boolean);
  const keys = requestedKeys?.length ? requestedKeys : ["auto_approve_comments"];
  if (keys.some(key => !ALLOWED_KEYS.has(key))) {
    return NextResponse.json({ error: "Unknown setting." }, { status: 400 });
  }

  const supabase = getD1("DB");
  if (!supabase) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  const { data, error } = await (supabase as any)
    .from("site_settings")
    .select("key, value")
    .in("key", keys);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings: Record<string, string> = {};
  for (const row of data ?? []) settings[row.key] = row.value;
  return NextResponse.json({ ok: true, settings });
}

// PATCH /api/admin/settings  body: { key: string, value: string }
export async function PATCH(req: NextRequest) {
  const authClient = await createClient();
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { key?: unknown; value?: unknown };
  try {
    body = await req.json() as { key?: unknown; value?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body.key !== "string" || !ALLOWED_KEYS.has(body.key)) {
    return NextResponse.json({ error: "Unknown setting." }, { status: 400 });
  }
  const validationError = validateSetting(body.key, body.value);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const supabase = getD1("DB");
  if (!supabase) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  const { error } = await (supabase as any)
    .from("site_settings")
    .upsert({ key: body.key, value: body.value }, { onConflict: "key" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
