import Link from "next/link";

export function JsonToDartPreview() {
  return (
    <figure
      aria-label="Example: a JSON object and the Dart class generated from it"
      className="terminal-window shadow-terminal"
    >
      <div className="terminal-titlebar justify-between">
        <div className="flex items-center gap-1.5">
          <span className="terminal-dot" style={{ background: "#f87171" }} />
          <span className="terminal-dot" style={{ background: "#fbbf24" }} />
          <span className="terminal-dot" style={{ background: "#4ade80" }} />
          <span className="ml-2 text-ink-faint text-[11px] font-mono">user_model.dart</span>
        </div>
        <Link href="/tools/json-to-dart" className="text-[11px] font-mono text-accent-light hover:text-ink transition-colors">
          Open tool
        </Link>
      </div>

      <div className="grid md:grid-cols-2 md:divide-x divide-border font-mono text-[12.5px] leading-relaxed">
        <pre className="p-4 overflow-x-auto bg-bg-secondary/60 text-ink-muted"><code>
{`{
  `}<span className="text-teal">&quot;id&quot;</span>{`: `}<span className="text-tertiary">402</span>{`,
  `}<span className="text-teal">&quot;name&quot;</span>{`: `}<span className="text-teal">&quot;Bilal&quot;</span>{`,
  `}<span className="text-teal">&quot;is_pro&quot;</span>{`: `}<span className="text-accent-light">true</span>{`
}`}</code></pre>
        <pre className="p-4 overflow-x-auto text-ink-muted"><code>
<span className="text-accent-light">class</span>{` `}<span className="text-teal">UserModel</span>{` {
  `}<span className="text-accent-light">final</span>{` `}<span className="text-teal">int</span>{` id;
  `}<span className="text-accent-light">final</span>{` `}<span className="text-teal">String</span>{` name;
  `}<span className="text-accent-light">final</span>{` `}<span className="text-teal">bool</span>{` isPro;

  `}<span className="text-accent-light">const</span>{` UserModel({
    `}<span className="text-accent-light">required</span>{` this.id,
    `}<span className="text-accent-light">required</span>{` this.name,
    `}<span className="text-accent-light">required</span>{` this.isPro,
  });
}`}</code></pre>
      </div>

      <figcaption className="px-4 py-2 border-t border-border text-[11px] font-mono text-ink-faint">
        Example. The real tool also generates fromJson, toJson and copyWith.
      </figcaption>
    </figure>
  );
}
