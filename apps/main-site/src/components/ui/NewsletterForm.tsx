"use client";

export function NewsletterForm() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      onSubmit={(e) => { e.preventDefault(); alert("Thanks! Newsletter coming soon."); }}
    >
      <input
        type="email"
        placeholder="your@email.com"
        className="flex-1 px-4 py-3 rounded-lg bg-bg-card border border-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors text-sm"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors"
      >
        Subscribe
      </button>
    </form>
  );
}
