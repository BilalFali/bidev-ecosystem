import { unstable_cache } from "next/cache";
import { ArrowRight } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  url: string;
}

function isSafeUrl(value: string) {
  if (!value || value !== value.trim() || /[\u0000-\u001f\u007f\\]/.test(value)) {
    return false;
  }
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const getAnnouncementSettings = unstable_cache(
  async (): Promise<AnnouncementSettings | null> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error("Announcement banner could not load: D1 is not configured.");
      return null;
    }

    const { data, error } = await (supabase as any)
      .from("site_settings")
      .select("value")
      .eq("key", "announcement_banner")
      .maybeSingle();

    if (error) {
      console.error("Announcement banner could not load:", error.message);
      return null;
    }
    if (!data) return null;

    try {
      const settings = JSON.parse(data.value) as AnnouncementSettings;
      if (
        typeof settings.enabled !== "boolean" ||
        typeof settings.text !== "string" ||
        typeof settings.url !== "string"
      ) {
        console.error("Announcement banner settings have an invalid shape.");
        return null;
      }
      if (!settings.enabled) return null;
      if (!settings.text.trim() || !isSafeUrl(settings.url)) {
        console.error("Enabled announcement banner settings have invalid text or URL.");
        return null;
      }

      return settings;
    } catch (error) {
      console.error("Announcement banner settings contain invalid JSON:", error);
      return null;
    }
  },
  ["announcement-banner"],
  { revalidate: 60 }
);

export async function AnnouncementBanner() {
  const settings = await getAnnouncementSettings();
  if (!settings) return null;

  return (
    <div className="relative z-[60] w-full">
      <a
        href={settings.url}
        className="flex min-h-11 w-full items-center justify-center gap-2 bg-accent px-4 py-2.5 text-center text-sm font-semibold text-accent-strong transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span>{settings.text}</span>
        <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
      </a>
    </div>
  );
}
