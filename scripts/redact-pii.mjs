/**
 * One-off PII redaction for parcel "proof of ownership" images.
 *
 * The parcel galleries originally contained raw scans of land-title books,
 * notarized transfer contracts and tax receipts — exposing real names,
 * CMND/CCCD national-ID numbers, addresses, phone numbers and tax codes.
 *
 * Per the agreed plan we keep ONE red-book cover per parcel as a
 * "we hold the so do" proof, with the owner block blurred out, and drop the
 * rest from the galleries (see each parcel's frontmatter `images:` list).
 *
 * Rectangles are expressed as fractions of the image (left, top, w, h) so they
 * scale to each scan's resolution. We over-cover deliberately — a missed digit
 * defeats the purpose. Run: `node scripts/redact-pii.mjs`.
 */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (rel) => path.join(root, "src/assets/parcels", rel);
const SITE = (rel) => path.join(root, "src/assets/site", rel);

/** Each job: source scan + opaque bars over PII + one-or-more output paths. */
const jobs = [
  {
    // Two-page spread; owner block (Ông/Bà + CMND + address) on the right page.
    // The home hero is a tight crop of this same cover (see homeCrop below).
    src: P("binh-trung-1-5-ha/08.jpg"),
    out: [P("binh-trung-1-5-ha/08.jpg")],
    rects: [{ left: 0.53, top: 0.48, w: 0.46, h: 0.3 }],
  },
  {
    src: P("song-phan-2-9ha/04.jpg"),
    out: [P("song-phan-2-9ha/04.jpg")],
    rects: [
      { left: 0.52, top: 0.5, w: 0.47, h: 0.28 }, // right-page owner block
      { left: 0.0, top: 0.0, w: 0.4, h: 0.42 }, // left-page transfer notes (CCCD/CMND)
    ],
  },
  {
    src: P("di-linh-5-sao/04.jpg"),
    out: [P("di-linh-5-sao/04.jpg")],
    rects: [{ left: 0.0, top: 0.9, w: 1.0, h: 0.1 }], // GCN serial + registrar signature strip
  },
  {
    src: P("dong-so-huu-hoa-long/02.jpg"),
    out: [P("dong-so-huu-hoa-long/02.jpg")],
    rects: [{ left: 0.02, top: 0.47, w: 0.97, h: 0.5 }], // owner + dozens of co-owners
  },
  {
    src: P("3-3-sao-hoa-long/04.jpg"),
    out: [P("3-3-sao-hoa-long/04.jpg")],
    rects: [{ left: 0.52, top: 0.55, w: 0.47, h: 0.22 }],
  },
  {
    src: P("long-tan-3-5-ha/04.jpg"),
    out: [P("long-tan-3-5-ha/04.jpg")],
    rects: [{ left: 0.52, top: 0.54, w: 0.47, h: 0.2 }],
  },
  {
    // phu-yen has no land photos; this clean cover (BT174132) is its only proof.
    src: P("phu-yen-58-ha/02.jpg"),
    out: [P("phu-yen-58-ha/02.jpg")],
    rects: [{ left: 0.54, top: 0.51, w: 0.45, h: 0.28 }],
  },
  {
    src: P("vuon-buoi-suoi-rao-2-7-ha/13.jpg"),
    out: [P("vuon-buoi-suoi-rao-2-7-ha/13.jpg")],
    rects: [{ left: 0.05, top: 0.5, w: 0.9, h: 0.27 }],
  },
];

/**
 * Frosted, irreversible redaction for one rect: crop -> mosaic -> blur.
 * The mosaic downsample collapses the text to a few pixels BEFORE the blur, so
 * the characters are genuinely destroyed (a plain Gaussian blur can sometimes be
 * sharpened back); the final blur just makes it read as a soft frost.
 */
const blurRegion = async (srcBuf, W, H, b) => {
  const x = Math.max(0, Math.round(b.left * W));
  const y = Math.max(0, Math.round(b.top * H));
  const w = Math.min(W - x, Math.round(b.w * W));
  const h = Math.min(H - y, Math.round(b.h * H));
  const mosaic = Math.max(6, Math.round(w / 22)); // pixel width text collapses to
  const input = await sharp(srcBuf)
    .extract({ left: x, top: y, width: w, height: h })
    .resize(mosaic, null, { fit: "inside" }) // downsample — obliterates text
    .resize(w, h, { kernel: "cubic" }) // back up to original size
    .blur(Math.max(8, Math.min(w, h) * 0.05)) // soften into a frosted blur
    .toBuffer();
  return { input, left: x, top: y };
};

for (const job of jobs) {
  const srcBuf = await readFile(job.src); // detach from the file handle
  const { width, height } = await sharp(srcBuf).metadata();
  const overlays = await Promise.all(
    job.rects.map((b) => blurRegion(srcBuf, width, height, b)),
  );
  const outBuf = await sharp(srcBuf)
    .composite(overlays)
    .jpeg({ quality: 88 })
    .toBuffer();
  for (const out of job.out) {
    await writeFile(out, outBuf);
    console.log(`redacted -> ${path.relative(root, out)} (${width}x${height})`);
  }
}

// Home hero (src/assets/site/red-book.jpg): the Trust band shows this in a 4:3
// card, so a full two-page spread reads tiny. Crop the freshly-redacted
// binh-trung cover to just the right page (emblem + title + blurred owner strip)
// so the certificate fills the frame.
{
  const buf = await readFile(P("binh-trung-1-5-ha/08.jpg"));
  const { width, height } = await sharp(buf).metadata();
  const c = { left: 0.45, top: 0.06, w: 0.54, h: 0.62 };
  const x = Math.round(c.left * width);
  const y = Math.round(c.top * height);
  const w = Math.min(width - x, Math.round(c.w * width));
  const h = Math.min(height - y, Math.round(c.h * height));
  await sharp(buf)
    .extract({ left: x, top: y, width: w, height: h })
    .jpeg({ quality: 90 })
    .toFile(SITE("red-book.jpg"));
  console.log(`home hero -> src/assets/site/red-book.jpg (${w}x${h})`);
}
