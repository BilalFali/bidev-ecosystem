export default function CloudflareAccessRequiredPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="max-w-md rounded-xl border border-border bg-bg-elevated p-6 text-center">
        <h1 className="text-xl font-bold text-ink">Cloudflare Access required</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Open this Admin through the Cloudflare Access protected route.
        </p>
      </div>
    </main>
  );
}
