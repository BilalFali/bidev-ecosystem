"use client";

export function ContactForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! I'll get back to you within 24 hours.");
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-5">
        {[["Name","text","Your name"],["Email","email","your@email.com"]].map(([label,type,placeholder]) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">{label}</label>
            <input type={type} required placeholder={placeholder}
              className="px-4 py-3 rounded-lg bg-bg-card border border-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent text-sm transition-colors" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Budget range</label>
        <select className="px-4 py-3 rounded-lg bg-bg-card border border-border text-ink focus:outline-none focus:border-accent text-sm transition-colors">
          <option value="">Select budget</option>
          {["< $500","$500 – $2,000","$2,000 – $5,000","$5,000 – $10,000","$10,000+"].map(b => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Message</label>
        <textarea required rows={6} placeholder="Describe your project — platform, features, timeline…"
          className="px-4 py-3 rounded-lg bg-bg-card border border-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent text-sm transition-colors resize-y" />
      </div>
      <button type="submit"
        className="self-start px-8 py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors">
        Send Message
      </button>
    </form>
  );
}
