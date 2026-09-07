export function NewsletterCard() {
  return (
    <div className="bg-paper-sunken border-y border-border py-12">
      <div className="mx-auto max-w-xl px-4 sm:px-6 text-center flex flex-col items-center gap-3">
        <h2 className="font-display text-2xl text-ink">The BiDev Tech briefing</h2>
        <p className="text-ink-muted text-sm max-w-md">
          The stories that matter in AI, hardware, and big tech — once a week, no noise.
        </p>
        <form className="flex w-full max-w-sm gap-2 mt-2">
          <input
            type="email"
            required
            placeholder="you@email.com"
            aria-label="Email address"
            className="flex-1 px-3 py-2 text-sm bg-paper-raised border border-border focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-accent text-paper-raised hover:bg-accent-hover transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
