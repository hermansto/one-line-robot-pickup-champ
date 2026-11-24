import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: exactly one robot pickup line, no trailing newline.
const line =
  "Beep boop — my circuits overheated the second you smiled, so I'm now running on love and one very tired cooling fan.";

if (line.includes("\n") || line.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (line.length > 200) {
  throw new Error(`entry is ${line.length} chars, over the 200 limit`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, line, "utf8");

// Read it back and confirm the bytes on disk are exactly the line,
// with no trailing newline sneaking in. Compare as raw bytes, not
// just as text, so a stray "\n" at the end would fail loudly here.
const back = readFileSync(outPath);
const expected = Buffer.from(line, "utf8");
if (!back.equals(expected)) {
  throw new Error("entry.txt does not match the line byte-for-byte");
}
if (back.length === 0 || back[back.length - 1] === 0x0a) {
  throw new Error("entry.txt must not end with a newline");
}
console.log(`Wrote ${line.length} chars (${expected.length} bytes) to ${outPath}`);
