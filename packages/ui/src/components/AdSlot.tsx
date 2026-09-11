"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

type SlotType = "banner" | "in-article" | "sidebar" | "footer";

interface AdSlotProps {
  type?: SlotType;
  className?: string;
}

const FORMAT: Record<SlotType, { adFormat: string }> = {
  "banner":     { adFormat: "auto" },
  "in-article": { adFormat: "auto" },
  "sidebar":    { adFormat: "auto" },
  "footer":     { adFormat: "auto" },
};

// Next.js only statically inlines `process.env.NEXT_PUBLIC_X` when accessed
// with literal dot-notation. Dynamic bracket access (`process.env[key]`)
// never gets replaced in the client bundle, so it silently resolves to
// undefined in the browser while still working server-side (real Node.js
// process.env) — a server/client mismatch that breaks hydration. Each slot
// env var must be referenced literally so the compiler can inline all four.
const SLOT_ID: Record<SlotType, string | undefined> = {
  "banner":     process.env.NEXT_PUBLIC_AD_SLOT_BANNER,
  "in-article": process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE,
  "sidebar":    process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR,
  "footer":     process.env.NEXT_PUBLIC_AD_SLOT_FOOTER,
};

export function AdSlot({ type = "banner", className = "" }: AdSlotProps) {
  const ref    = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const slotId      = SLOT_ID[type];

  useEffect(() => {
    if (!publisherId || !slotId || pushed.current || !ref.current) return;
    try {
      pushed.current = true;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet — auto ads script handles it
    }
  }, [publisherId, slotId]);

  // Nothing to render if env vars aren't set — Auto Ads fills the page instead
  if (!publisherId || !slotId) return null;

  const { adFormat } = FORMAT[type];

  return (
    // Ad creatives usually render on a white background regardless of the
    // page's own theme. On a dark-themed app (main-site/admin, via the
    // bg-card/border tokens from packages/config) that reads as a jarring
    // floating white box, so the ad sits inside a padded, bordered card
    // instead — the white creative reads as intentionally framed. These
    // class names resolve to nothing (harmless no-op) on light-themed apps
    // like tech-blog that don't define the bg-card token, since a white ad
    // already blends into a light page there.
    <div className={`bg-bg-card border border-border rounded-lg p-3 ${className}`} aria-label="Advertisement">
      <span className="block text-center text-[10px] uppercase tracking-wider text-ink-faint mb-2 select-none">
        Advertisement
      </span>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
