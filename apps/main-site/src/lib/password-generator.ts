export const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export type CharType = keyof typeof CHARS;

function randomInt(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

export function generatePassword(len: number, opts: Record<CharType, boolean>): string {
  let pool = "";
  const req: string[] = [];
  (Object.keys(opts) as CharType[]).forEach((k) => {
    if (!opts[k]) return;
    pool += CHARS[k];
    req.push(CHARS[k][randomInt(CHARS[k].length)]);
  });
  if (!pool) return "";

  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  const chars = Array.from(arr, (n) => pool[n % pool.length]);

  // Place each required character at its own distinct position so enabling
  // multiple character types can't have one required char silently
  // overwrite another at the same index.
  const positions: number[] = [];
  while (positions.length < Math.min(req.length, len)) {
    const p = randomInt(len);
    if (!positions.includes(p)) positions.push(p);
  }
  positions.forEach((pos, i) => {
    chars[pos] = req[i];
  });

  return chars.join("");
}
