/**
 * One-off: reverse-geocode each parcel's coords via Geoapify and write a clean
 * Vietnamese location label into its markdown frontmatter.
 *
 * Uses the SINGLE reverse endpoint (not the batch API, which was hanging on 202
 * in the Netlify build log). Reuses GEOAPIFY_KEY from .env.
 *
 *   node scripts/geocode-parcels.mjs            # dry run: print only
 *   node scripts/geocode-parcels.mjs --write    # write location: back into .md
 *
 * FINDING (2026-06): Geoapify reverse-geocoding is UNRELIABLE for these rural
 * plots — it snaps to the nearest named POI (a gas station, a canal) and even
 * the wrong district (Đất Đỏ instead of Hòa Long / Long Tân). The owner's
 * listing titles are the authoritative source for commune/district, so DO NOT
 * --write blindly. Keep this as a dry-run cross-check only.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const WRITE = process.argv.includes("--write");
const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const PARCELS_DIR = path.join(ROOT, "src/content/parcels");

// .env loader (handles `KEY = value`)
for (const line of fs.readFileSync(path.join(ROOT, ".env"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim();
}
const KEY = process.env.GEOAPIFY_KEY;

// Strip admin-type prefixes for a prettier label.
const tidy = (s) =>
  s &&
  s
    .replace(/^(Xã|Phường|Thị trấn|Huyện|Quận|Thành phố|Tỉnh)\s+/i, "")
    .trim();

// Build "Commune, District" (province dropped — it's recognizable + merger-stale).
function prettyLabel(props) {
  const locality =
    props.suburb ||
    props.village ||
    props.hamlet ||
    props.neighbourhood ||
    props.city_district ||
    props.municipality;
  const district = props.county || props.district || props.city;
  const parts = [tidy(locality), tidy(district)].filter(Boolean);
  // de-dupe if locality === district
  const uniq = [...new Set(parts)];
  return uniq.join(", ");
}

async function reverse(lat, lon) {
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=vi&format=json&apiKey=${KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.results?.[0] || {};
}

const files = fs.readdirSync(PARCELS_DIR).filter((f) => f.endsWith(".md"));
for (const file of files) {
  const fp = path.join(PARCELS_DIR, file);
  const md = fs.readFileSync(fp, "utf8");
  const cm = md.match(/coords:\s*\n\s*-\s*([-\d.]+)\s*\n\s*-\s*([-\d.]+)/);
  if (!cm) {
    console.log(`SKIP ${file} (no coords)`);
    continue;
  }
  const [lat, lon] = [cm[1], cm[2]];
  const props = await reverse(lat, lon);
  const label = prettyLabel(props);
  const current = (md.match(/location:\s*"(.*?)"/) || [])[1];

  console.log(`\n${file}`);
  console.log(`  coords:    ${lat}, ${lon}`);
  console.log(`  current:   "${current}"`);
  console.log(`  geoapify:  "${label}"`);
  console.log(`  formatted: ${props.formatted || "(none)"}`);
  console.log(
    `  fields:    ${JSON.stringify({
      suburb: props.suburb,
      village: props.village,
      hamlet: props.hamlet,
      city_district: props.city_district,
      county: props.county,
      district: props.district,
      city: props.city,
      state: props.state,
    })}`,
  );

  if (WRITE && label) {
    const updated = md.replace(/location:\s*".*?"/, `location: "${label}"`);
    fs.writeFileSync(fp, updated, "utf8");
    console.log(`  -> wrote location: "${label}"`);
  }
}
