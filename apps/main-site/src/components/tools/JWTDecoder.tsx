"use client";

import { useMemo, useState } from "react";
import { AdSlot } from "@bidev/ui";

interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

function decodeJWT(token: string): DecodedJWT {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("A JWT must have 3 parts separated by dots (header.payload.signature).");
  const [headerB64, payloadB64, signature] = parts;
  const header = JSON.parse(base64UrlDecode(headerB64));
  const payload = JSON.parse(base64UrlDecode(payloadB64));
  return { header, payload, signature };
}

function formatClaimDate(value: unknown): string | null {
  if (typeof value !== "number") return null;
  return new Date(value * 1000).toLocaleString();
}

export function JWTDecoder() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState<"header" | "payload" | null>(null);

  const { decoded, error } = useMemo(() => {
    if (!token.trim()) return { decoded: null, error: "" };
    try {
      return { decoded: decodeJWT(token), error: "" };
    } catch (e) {
      return { decoded: null, error: e instanceof Error ? e.message : "Invalid token." };
    }
  }, [token]);

  const exp = decoded?.payload?.exp;
  const expDate = formatClaimDate(exp);
  const isExpired = typeof exp === "number" ? Date.now() >= exp * 1000 : null;

  async function copy(which: "header" | "payload", value: object) {
    await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      <nav className="text-xs text-ink-faint mb-5">
        <a href="/tools" className="hover:text-ink-muted transition-colors">Tools</a> / JWT Decoder
      </nav>
      <h1 className="text-3xl font-bold text-ink mb-2">JWT Decoder</h1>
      <p className="text-ink-muted mb-2">Paste a JSON Web Token to inspect its header and payload.</p>
      <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mb-8 inline-block">
        This tool only decodes the token — it does not verify the signature.
      </p>

      <AdSlot type="banner" className="mb-8" />

      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        rows={4}
        className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors text-sm font-mono resize-y"
      />

      {error && (
        <p className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {decoded && (
        <div className="mt-6 grid sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-bg-card">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Header</h2>
              <button onClick={() => copy("header", decoded.header)} className="text-xs text-accent hover:text-accent-hover transition-colors">
                {copied === "header" ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-xs font-mono text-ink-muted whitespace-pre-wrap break-all bg-bg-elevated rounded-lg p-3">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-bg-card">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Payload</h2>
              <button onClick={() => copy("payload", decoded.payload)} className="text-xs text-accent hover:text-accent-hover transition-colors">
                {copied === "payload" ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-xs font-mono text-ink-muted whitespace-pre-wrap break-all bg-bg-elevated rounded-lg p-3">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-3 px-4 py-3 rounded-lg border border-border bg-bg-elevated text-sm">
            <span className="text-ink-faint">Algorithm:</span>
            <span className="font-mono text-ink">{String(decoded.header.alg ?? "unknown")}</span>
            {expDate && (
              <>
                <span className="text-ink-faint ml-2">Expires:</span>
                <span className="font-mono text-ink">{expDate}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${isExpired ? "bg-red-500/15 text-red-400 border-red-500/25" : "bg-green-500/15 text-green-400 border-green-500/25"}`}>
                  {isExpired ? "Expired" : "Valid"}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <AdSlot type="in-article" className="mt-8" />
    </div>
  );
}
