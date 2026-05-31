"use client";

export function ContactForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! I'll get back to you within 24 hours.");
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Name</label>
          <input type="text" required placeholder="Your name"
            className="px-4 py-3 rounded-lg bg-bg-card border border-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent text-sm transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Email</label>
          <input type="email" required placeholder="your@email.com"
            className="px-4 py-3 rounded-lg bg-bg-card border border-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent text-sm transition-colors" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Subject</label>
        <input type="text" placeholder="Tool suggestion, freelance, partnership…"
          className="px-4 py-3 rounded-lg bg-bg-card border border-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent text-sm transition-colors" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Message</label>
        <textarea required rows={6} placeholder="Tell me about it…"
          className="px-4 py-3 rounded-lg bg-bg-card border border-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent text-sm transition-colors resize-y" />
      </div>
      <button type="submit"
        className="self-start px-8 py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors">
        Send Message
      </button>
    </form>
  );
}
