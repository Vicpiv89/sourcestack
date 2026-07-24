// Regenerates public/sitemap.xml from the actual data files, so it can't drift out of
// sync with the catalog again (it was hand-maintained before and quietly went stale —
// missing /ai entirely, off by one on both issues and treatments counts).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function extractSlugs(path) {
  const src = readFileSync(join(root, path), "utf-8");
  return [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

const BASE_URL = "https://sourcestack.app";
const today = new Date().toISOString().slice(0, 10);

const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/issues", changefreq: "weekly", priority: "0.8" },
  { path: "/treatments", changefreq: "weekly", priority: "0.8" },
  { path: "/scan", changefreq: "monthly", priority: "0.9" },
  { path: "/ai", changefreq: "monthly", priority: "0.8" },
  { path: "/stack", changefreq: "monthly", priority: "0.7" },
  { path: "/quiz", changefreq: "monthly", priority: "0.7" },
  { path: "/compare", changefreq: "monthly", priority: "0.6" },
  { path: "/about", changefreq: "monthly", priority: "0.4" },
  { path: "/disclaimer", changefreq: "yearly", priority: "0.2" },
  { path: "/terms", changefreq: "yearly", priority: "0.2" },
  { path: "/privacy", changefreq: "yearly", priority: "0.2" },
  // /account is user-specific (noindexed in-page) and /studio is an internal,
  // robots-disallowed tool — neither belongs in the sitemap.
];

const issueSlugs = extractSlugs("src/data/issues.ts");
const treatmentSlugs = extractSlugs("src/data/treatments.ts");

const urls = [
  ...STATIC_PAGES.map((p) => ({ loc: p.path, changefreq: p.changefreq, priority: p.priority })),
  ...issueSlugs.map((slug) => ({ loc: `/issues/${slug}`, changefreq: "monthly", priority: "0.7" })),
  ...treatmentSlugs.map((slug) => ({ loc: `/treatments/${slug}`, changefreq: "monthly", priority: "0.6" })),
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url><loc>${BASE_URL}${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
    )
    .join("\n") +
  `\n</urlset>\n`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`sitemap.xml: ${urls.length} URLs (${STATIC_PAGES.length} static, ${issueSlugs.length} issues, ${treatmentSlugs.length} treatments)`);
