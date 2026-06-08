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

const ENV_KEY: Record<SlotType, string> = {
  "banner":     "NEXT_PUBLIC_AD_SLOT_BANNER",
  "in-article": "NEXT_PUBLIC_AD_SLOT_IN_ARTICLE",
  "sidebar":    "NEXT_PUBLIC_AD_SLOT_SIDEBAR",
  "footer":     "NEXT_PUBLIC_AD_SLOT_FOOTER",
};

export function AdSlot({ type = "banner", className = "" }: AdSlotProps) {
  const ref    = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const slotId      = process.env[ENV_KEY[type]];

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
    <div className={className} aria-label="Advertisement">
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
