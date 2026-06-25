/**
 * One-off: download every self-hosted video from Contentful into
 * videos-to-upload/<parcel-slug>/ so they can be re-uploaded to YouTube
 * (unlisted). This folder is gitignored — delete it after uploading.
 *
 *   node scripts/download-videos.mjs
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as contentfulPkg from "contentful";

const createClient =
  contentfulPkg.createClient ?? contentfulPkg.default.createClient;

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const OUT = path.join(ROOT, "videos-to-upload");

for (const line of fs.readFileSync(path.join(ROOT, ".env"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim();
}

const titleToSlug = (title) =>
  (title || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function download(url, dest) {
  if (fs.existsSync(dest)) {
    console.log(`  exists, skip: ${path.basename(dest)}`);
    return fs.statSync(dest).size;
  }
  const full = url.startsWith("//") ? `https:${url}` : url;
  const res = await fetch(full);
  if (!res.ok) throw new Error(`${res.status} ${full}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN,
});

const lands = await client.getEntries({ content_type: "land", include: 2 });
const manifest = [];

for (const entry of lands.items) {
  const slug = titleToSlug(entry.fields.title);
  const vids = entry.fields.videofiles || [];
  let i = 0;
  for (const v of vids) {
    const url = v?.fields?.video?.fields?.file?.url;
    if (!url) continue;
    i++;
    const ext = (url.split("?")[0].match(/\.([a-z0-9]+)$/i)?.[1] || "mp4").toLowerCase();
    const name = `${slug}-vid-${String(i).padStart(2, "0")}.${ext}`;
    const dest = path.join(OUT, slug, name);
    process.stdout.write(`Downloading ${slug}/${name} ...`);
    const size = await download(url, dest);
    console.log(` ${mb(size)}`);
    manifest.push({ parcel: slug, part: i, file: `${slug}/${name}`, size });
  }
}

console.log("\n========== DOWNLOAD MANIFEST ==========");
let total = 0;
for (const m of manifest) {
  total += m.size;
  console.log(`  ${m.file}  (${mb(m.size)})`);
}
console.log(`\n${manifest.length} videos, ${mb(total)} total -> videos-to-upload/`);
console.log("=======================================");
