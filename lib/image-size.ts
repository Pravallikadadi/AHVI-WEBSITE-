import fs from "fs";
import path from "path";

function jpgSize(buf: Buffer): [number, number] | null {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    if (marker === 0xc0 || marker === 0xc2) {
      return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    }
    const len = buf.readUInt16BE(i + 2);
    i += 2 + len;
  }
  return null;
}

function pngSize(buf: Buffer): [number, number] {
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

function webpSize(buf: Buffer): [number, number] | null {
  const fmt = buf.toString("ascii", 12, 16);
  if (fmt === "VP8X") {
    const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
    const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
    return [w, h];
  }
  if (fmt === "VP8 ") {
    return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  }
  if (fmt === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
  }
  return null;
}

/** Reads a file's real pixel dimensions from its header — no external deps, JPEG/PNG/WebP only. */
function readDimensions(absPath: string): [number, number] {
  const buf = fs.readFileSync(absPath);
  const ext = path.extname(absPath).toLowerCase();
  const size = ext === ".png" ? pngSize(buf) : ext === ".webp" ? webpSize(buf) : jpgSize(buf);
  if (!size) throw new Error(`Could not read dimensions for ${absPath}`);
  return size;
}

/** Aspect ratio string ("w/h") for an image living under /public, read straight from the file — always current. */
export function getImageRatio(publicPath: string): string {
  const abs = path.join(process.cwd(), "public", publicPath);
  const [w, h] = readDimensions(abs);
  return `${w}/${h}`;
}
