// Assembles the cPanel-ready deploy folder after `next build` with output: "standalone".
// Next.js does not copy `public/` or `.next/static/` into the standalone output —
// this script does that, then leaves a single self-contained folder ready to zip/upload.
import { cpSync, existsSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const appDir       = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const standaloneDir = path.join(appDir, ".next", "standalone");
const appInStandalone = path.join(standaloneDir, "apps", "main-site");

if (!existsSync(standaloneDir)) {
  console.error('No .next/standalone found — run "next build" first.');
  process.exit(1);
}

// public/
cpSync(path.join(appDir, "public"), path.join(appInStandalone, "public"), { recursive: true });

// .next/static/
const staticDest = path.join(appInStandalone, ".next", "static");
rmSync(staticDest, { recursive: true, force: true });
cpSync(path.join(appDir, ".next", "static"), staticDest, { recursive: true });

console.log("Deploy folder ready at:", standaloneDir);
console.log("Upload its CONTENTS to the cPanel app root.");
console.log('Startup file in cPanel: apps/main-site/server.js');
