/**
 * One-off migration: Contentful "land" + "agent" entries -> markdown content
 * collections (src/content/parcels, src/content/agents) + local images
 * (src/assets/parcels, src/assets/agents).
 *
 * Run:  node --env-file=.env scripts/migrate-from-contentful.mjs
 *   (or just `node scripts/migrate-from-contentful.mjs` — it also parses .env)
 *
 * Idempotent-ish: re-running overwrites the generated files. v2-specific fields
 * that Contentful can't supply (price ranges, selling-point bullets, YouTube
 * ids, verification status) are filled best-effort and listed in the report.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as contentfulPkg from "contentful";

const createClient =
  contentfulPkg.createClient ?? contentfulPkg.default.createClient;

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const PARCELS_DIR = path.join(ROOT, "src/content/parcels");
const AGENTS_DIR = path.join(ROOT, "src/content/agents");
const PARCEL_ASSETS = path.join(ROOT, "src/assets/parcels");
const AGENT_ASSETS = path.join(ROOT, "src/assets/agents");

// --- Minimal .env loader (handles `KEY = value` with spaces, ignores #) ---
function loadEnv() {
  const file = path.join(ROOT, ".env");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

// Clean ASCII slug: strip Vietnamese diacritics, drop punctuation, dash-separate.
// e.g. "3,3 sào Hòa Long" -> "3-3-sao-hoa-long", "Phú Yên 58 ha" -> "phu-yen-58-ha"
const titleToSlug = (title) =>
  (title || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove combining diacritics
    .replace(/đ/gi, "d") // đ -> d
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // any run of non-alphanumerics -> single dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes

// --- Contentful RichText -> Markdown (covers the node types this site uses) ---
function inlineText(node) {
  if (node.nodeType === "text") {
    let t = node.value ?? "";
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") t = `**${t}**`;
      else if (mark.type === "italic") t = `_${t}_`;
      else if (mark.type === "code") t = `\`${t}\``;
    }
    return t;
  }
  if (node.nodeType === "hyperlink") {
    const inner = (node.content ?? []).map(inlineText).join("");
    return `[${inner}](${node.data?.uri ?? "#"})`;
  }
  return (node.content ?? []).map(inlineText).join("");
}

function richTextToMarkdown(doc) {
  if (!doc || !doc.content) return "";
  const blocks = [];
  const renderListItems = (listNode, ordered) =>
    (listNode.content ?? [])
      .map((li, i) => {
        const text = (li.content ?? [])
          .map((p) => (p.content ?? []).map(inlineText).join(""))
          .join(" ")
          .trim();
        return `${ordered ? `${i + 1}.` : "-"} ${text}`;
      })
      .join("\n");

  for (const node of doc.content) {
    switch (node.nodeType) {
      case "paragraph": {
        const t = (node.content ?? []).map(inlineText).join("").trim();
        if (t) blocks.push(t);
        break;
      }
      case "heading-1":
      case "heading-2":
      case "heading-3":
      case "heading-4": {
        const level = Number(node.nodeType.split("-")[1]);
        const t = (node.content ?? []).map(inlineText).join("").trim();
        blocks.push(`${"#".repeat(level)} ${t}`);
        break;
      }
      case "unordered-list":
        blocks.push(renderListItems(node, false));
        break;
      case "ordered-list":
        blocks.push(renderListItems(node, true));
        break;
      case "blockquote": {
        const t = (node.content ?? [])
          .map((p) => (p.content ?? []).map(inlineText).join(""))
          .join("\n");
        blocks.push(
          t
            .split("\n")
            .map((l) => `> ${l}`)
            .join("\n"),
        );
        break;
      }
      case "hr":
        blocks.push("---");
        break;
      default:
        break; // skip embedded entries/assets
    }
  }
  return blocks
    .join("\n\n")
    .trim()
    .replace(/\*\*\*\*/g, "") // merge adjacent bold runs (e.g. "m**​**2" -> "m2")
    .replace(/____/g, "");
}

// --- YAML helpers (avoid adding a yaml dependency) ---
const yamlStr = (s) => `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

function frontmatter(obj) {
  const lines = [];
  const emit = (key, val, indent = 0) => {
    const pad = "  ".repeat(indent);
    if (val === undefined || val === null) return;
    if (Array.isArray(val)) {
      if (val.length === 0) {
        lines.push(`${pad}${key}: []`);
        return;
      }
      lines.push(`${pad}${key}:`);
      for (const item of val) {
        if (item && typeof item === "object") {
          const entries = Object.entries(item);
          lines.push(`${pad}  - ${entries[0][0]}: ${fmtScalar(entries[0][1])}`);
          for (const [k, v] of entries.slice(1))
            lines.push(`${pad}    ${k}: ${fmtScalar(v)}`);
        } else {
          lines.push(`${pad}  - ${fmtScalar(item)}`);
        }
      }
    } else if (typeof val === "object") {
      lines.push(`${pad}${key}:`);
      for (const [k, v] of Object.entries(val)) emit(k, v, indent + 1);
    } else {
      lines.push(`${pad}${key}: ${fmtScalar(val)}`);
    }
  };
  const fmtScalar = (v) =>
    typeof v === "number" || typeof v === "boolean" ? String(v) : yamlStr(v);

  for (const [k, v] of Object.entries(obj)) emit(k, v);
  return lines.join("\n");
}

async function download(url, destPath) {
  if (fs.existsSync(destPath)) return; // idempotent re-runs
  const full = url.startsWith("//") ? `https:${url}` : url;
  const res = await fetch(full);
  if (!res.ok) throw new Error(`download ${res.status} ${full}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
}

function extFromUrl(url, fallback = "jpg") {
  const m = url.split("?")[0].match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : fallback;
}

// Contentful stores a single VND price; v2 advertises a range. Seed a tidy
// single value (e.g. 9.5 tỷ) the owner can widen into a range later.
function formatPrice(p) {
  if (p == null) return "";
  if (p >= 1e9) return `${+(p / 1e9).toFixed(2)} tỷ`;
  if (p >= 1e6) return `${+(p / 1e6).toFixed(0)} triệu`;
  return String(p);
}

// Big plots read better in hectares; small ones stay m².
function formatArea(v) {
  if (v == null) return { value: 0, unit: "m2" };
  return v >= 10000
    ? { value: +(v / 10000).toFixed(2), unit: "ha" }
    : { value: v, unit: "m2" };
}

function guessVerification(papers = "") {
  const p = papers.toLowerCase();
  if (/(đỏ|red book|sổ đỏ|sđ|sổ hồng)/.test(p)) return "red-book";
  if (/(quy hoạch|planning|chờ)/.test(p)) return "planning";
  return "pending";
}

// --------------------------------------------------------------------------
async function main() {
  const report = { parcels: [], agents: [], videos: [], warnings: [] };

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
    accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN,
  });

  fs.mkdirSync(PARCELS_DIR, { recursive: true });
  fs.mkdirSync(AGENTS_DIR, { recursive: true });

  // --- Lands -> parcels ---
  const lands = await client.getEntries({ content_type: "land", include: 2 });
  console.log(`Found ${lands.items.length} land entries.`);

  for (const entry of lands.items) {
    const f = entry.fields;
    const slug = titleToSlug(f.title);

    // Images
    const images = [];
    const imgs = f.images || [];
    for (let i = 0; i < imgs.length; i++) {
      const file = imgs[i]?.fields?.file;
      if (!file?.url) continue;
      const ext = extFromUrl(file.url);
      const name = `${String(i + 1).padStart(2, "0")}.${ext}`;
      await download(file.url, path.join(PARCEL_ASSETS, slug, name));
      images.push({
        src: `../../assets/parcels/${slug}/${name}`,
        alt: `${f.title} — ảnh ${i + 1}`,
      });
    }

    // Videos (self-hosted in Contentful) — record for manual YouTube re-upload
    for (const v of f.videofiles || []) {
      const url = v?.fields?.video?.fields?.file?.url;
      if (url) report.videos.push({ parcel: slug, url: `https:${url}` });
    }

    const priceRange = formatPrice(f.price);
    const data = {
      title: f.title || slug,
      location: f.address || "",
      order: 99,
      promoted: Boolean(f.promoted),
      verification: guessVerification(f.papers),
      ...(f.tag ? { tag: f.tag } : {}),
      area: formatArea(f.area),
      ...(f.faceSideLength != null ? { faceSideLength: f.faceSideLength } : {}),
      priceRange, // TODO: widen into a range like "4.2 tỷ–4.6 tỷ"
      negotiable: true,
      ...(f.location
        ? { coords: [f.location.lat, f.location.lon] }
        : {}),
      ...(f.briefDescription ? { briefDescription: f.briefDescription } : {}),
      sellingPoints: [], // TODO: author 3 bullets per parcel (v2)
      zaloMessage: `Chào anh/chị, em muốn hỏi giá và pháp lý lô ${f.title || slug}.`,
      images,
      suggestedParcels: (f.suggestedLands || [])
        .map((l) => titleToSlug(l?.fields?.title))
        .filter(Boolean),
    };

    const body = richTextToMarkdown(f.longDescription);
    const md = `---\n${frontmatter(data)}\n---\n\n${body}\n`;
    fs.writeFileSync(path.join(PARCELS_DIR, `${slug}.md`), md, "utf8");
    report.parcels.push(slug);

    if (!f.address)
      report.warnings.push(`${slug}: no address — fill "location" manually`);
    if (!priceRange)
      report.warnings.push(`${slug}: no price — fill "priceRange" manually`);
  }

  // --- Agents ---
  const agents = await client.getEntries({ content_type: "agent" });
  console.log(`Found ${agents.items.length} agent entries.`);
  for (const entry of agents.items) {
    const f = entry.fields;
    const slug = titleToSlug(f.name);
    let photo;
    const purl = f.profilePhoto?.fields?.file?.url;
    if (purl) {
      const ext = extFromUrl(purl, "jpg");
      const name = `${slug}.${ext}`;
      await download(purl, path.join(AGENT_ASSETS, name));
      photo = `../../assets/agents/${name}`;
    }
    const data = {
      name: f.name,
      position: f.positionName || "",
      order: 99,
      ...(photo ? { photo } : {}),
      ...(f.phoneNumber ? { phone: f.phoneNumber } : {}),
      ...(f.zaloUrl ? { zalo: f.zaloUrl } : {}),
      ...(f.facebookUrl ? { facebook: f.facebookUrl } : {}),
    };
    const md = `---\n${frontmatter(data)}\n---\n`;
    fs.writeFileSync(path.join(AGENTS_DIR, `${slug}.md`), md, "utf8");
    report.agents.push(slug);
  }

  // --- Report ---
  console.log("\n========== MIGRATION REPORT ==========");
  console.log(`Parcels written: ${report.parcels.length}`);
  report.parcels.forEach((s) => console.log(`  - src/content/parcels/${s}.md`));
  console.log(`Agents written: ${report.agents.length}`);
  report.agents.forEach((s) => console.log(`  - src/content/agents/${s}.md`));

  if (report.videos.length) {
    console.log(`\nVideos to RE-UPLOAD to YouTube (then set youtubeId):`);
    report.videos.forEach((v) => console.log(`  - [${v.parcel}] ${v.url}`));
  }
  if (report.warnings.length) {
    console.log(`\nManual attention needed:`);
    report.warnings.forEach((w) => console.log(`  ! ${w}`));
  }
  console.log(
    `\nNEXT (per parcel, v2 fields): priceRange -> range string, sellingPoints -> 3 bullets, verify "verification" badge, set youtubeId.`,
  );
  console.log("======================================\n");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
