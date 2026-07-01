// Client-side canvas cover generator — no external API required.
// Produces a 1200×630 branded PNG matching the Bidev dark design system.

export interface CoverOptions {
  title: string;
  category: string;
  emoji: string;
  subtitle?: string;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generateCover(opts: CoverOptions): Promise<Blob> {
  const W = 1200;
  const H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ── Background ──────────────────────────────────────────────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, "#101418");
  bgGrad.addColorStop(1, "#1c2025");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // ── Accent glow ─────────────────────────────────────────────────────────────
  const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 420);
  glow.addColorStop(0, "rgba(1,117,194,0.18)");
  glow.addColorStop(1, "rgba(1,117,194,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Grid lines (subtle) ──────────────────────────────────────────────────────
  ctx.strokeStyle = "rgba(64,71,81,0.25)";
  ctx.lineWidth = 1;
  const step = 60;
  for (let x = 0; x < W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // ── Border ──────────────────────────────────────────────────────────────────
  const borderGrad = ctx.createLinearGradient(0, 0, W, H);
  borderGrad.addColorStop(0, "rgba(1,117,194,0.6)");
  borderGrad.addColorStop(1, "rgba(1,117,194,0.15)");
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  // ── Emoji ────────────────────────────────────────────────────────────────────
  ctx.font = "96px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(opts.emoji, W / 2, 160);

  // ── Title ────────────────────────────────────────────────────────────────────
  ctx.font = `bold 72px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillStyle = "#e0e2e9";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const titleLines = wrapText(ctx, opts.title, 960);
  const lineH = 88;
  const totalH = titleLines.length * lineH;
  const titleStartY = H / 2 - totalH / 2 + 30;

  titleLines.forEach((line, i) => {
    ctx.fillText(line, W / 2, titleStartY + i * lineH);
  });

  // ── Category chip ────────────────────────────────────────────────────────────
  const chipY = titleStartY + totalH + 28;
  const chipText = opts.category.toUpperCase();
  ctx.font = `600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  const chipW = ctx.measureText(chipText).width + 40;
  const chipH = 38;
  const chipX = W / 2 - chipW / 2;

  ctx.fillStyle = "rgba(1,117,194,0.12)";
  ctx.beginPath();
  ctx.roundRect(chipX, chipY - chipH / 2, chipW, chipH, 20);
  ctx.fill();

  ctx.strokeStyle = "rgba(1,117,194,0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(chipX, chipY - chipH / 2, chipW, chipH, 20);
  ctx.stroke();

  ctx.fillStyle = "#9ecaff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(chipText, W / 2, chipY);

  // ── Bidev branding ───────────────────────────────────────────────────────────
  ctx.font = `500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillStyle = "rgba(138,145,156,0.7)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("bidev.site", W / 2, H - 36);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
      "image/png"
    );
  });
}
