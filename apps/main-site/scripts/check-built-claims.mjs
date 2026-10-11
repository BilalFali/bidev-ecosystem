import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../.next/server/app/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const FORBIDDEN = [
  "4,200", "Staff Mobile Architect", "Verified on Google Play", "Flutter 3.29",
  "48 articles", "0ms latency", "LATENCY", "ALL SYSTEMS OPERATIONAL", "System Status",
  "SaaS Mobile Starter Kit", "Clean Architecture Template", "every Tuesday", "Bookmark",
];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

const files = walk(root);
let failed = 0;
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const phrase of FORBIDDEN) {
    if (html.includes(phrase)) {
      console.error(`FAIL  "${phrase}" in ${file}`);
      failed++;
    }
  }
}

const must = (file, text) => {
  const html = readFileSync(join(root, file), "utf8");
  if (!html.includes(text)) {
    console.error(`FAIL  ${file} is missing "${text}"`);
    failed++;
  }
};
must("index.html", 'id="newsletter"');
must("blog/dart-flutter-mcp-server-explained.html", "// on this page");

console.log(`${files.length} pages checked`);
if (failed) process.exit(1);
console.log("OK");
