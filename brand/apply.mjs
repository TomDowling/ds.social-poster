#!/usr/bin/env node
// Re-brands the Postiz frontend source as Digital Space Social Poster, before `next build` runs in the Dockerfile.
// Every step checks that what it expects is still there and stops the build if not, so a Postiz update that moves
// things fails loudly instead of quietly showing the Postiz name again.
import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const BRAND = "Digital Space Social Poster";
const HASHTAG = "#DigitalSpace";
const APP = process.env.POSTIZ_DIR || "/app";
const HERE = path.dirname(new URL(import.meta.url).pathname);
const FRONT = path.join(APP, "apps/frontend");
const SHARED = path.join(APP, "libraries/react-shared-libraries/src");

const fail = (msg) => {
  console.error(`ds-brand: ${msg}`);
  process.exit(1);
};

// 1. Whole-file swaps: the logos and the testimonials. Same export names as upstream.
const overrides = path.join(HERE, "overrides");
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(path.join(dir, f)).isDirectory() ? walk(path.join(dir, f)) : [path.join(dir, f)]));
for (const src of walk(overrides)) {
  const rel = path.relative(overrides, src);
  const dest = path.join(FRONT, "src", rel);
  if (!existsSync(dest)) fail(`upstream file moved or renamed: apps/frontend/src/${rel}`);
  const name = readFileSync(src, "utf8").match(/export const (\w+)/)[1];
  if (!readFileSync(dest, "utf8").includes(`export const ${name}`)) fail(`upstream ${rel} no longer exports ${name}`);
  cpSync(src, dest);
  console.log(`ds-brand: swapped ${rel}`);
}

// 2. Targeted edits.
const edits = [
  {
    file: "src/app/(app)/auth/layout.tsx",
    find: /Over <span[^>]*>20,000\+<\/span>[\s\S]*?Postiz To Grow Their Social Presence/,
    replace: "Schedule and publish to all your social accounts<br />from one place",
  },
  {
    // AGPL: people using the app must be offered its source. It sits in Settings (behind the login), not on the
    // sign-in page, so app reviewers don't land on a page about another product.
    file: "src/components/settings/global.settings.tsx",
    find: /<DeleteAccountComponent \/>/,
    replace:
      '<DeleteAccountComponent />\n      <div className="mt-[24px] text-[13px] opacity-60">This app is open source (AGPL-3.0). <a href="https://github.com/TomDowling/ds.social-poster" target="_blank" rel="noreferrer" className="underline">Source code</a></div>',
  },
];
for (const e of edits) {
  const f = path.join(FRONT, e.file);
  if (!existsSync(f)) fail(`upstream file moved: apps/frontend/${e.file}`);
  const before = readFileSync(f, "utf8");
  if (!e.find.test(before)) fail(`edit no longer matches in apps/frontend/${e.file}: ${e.find}`);
  writeFileSync(f, before.replace(e.find, e.replace));
  console.log(`ds-brand: edited ${e.file}`);
}

// 3. The name everywhere people can read it: page titles, labels, translations (all languages).
let files = 0;
let hits = 0;
for (const root of [path.join(FRONT, "src"), SHARED]) {
  for (const f of walk(root)) {
    if (!/\.(tsx?|json)$/.test(f)) continue;
    const before = readFileSync(f, "utf8");
    const n = (before.match(/\bPostiz\b/g) || []).length;
    if (!n) continue;
    writeFileSync(f, before.replace(/#Postiz\b/g, HASHTAG).replace(/\bPostiz\b/g, BRAND));
    files++;
    hits += n;
  }
}
console.log(`ds-brand: renamed Postiz in ${hits} places across ${files} files`);
if (hits < 50) fail(`only ${hits} renames; expected 100+. Postiz has changed how it names itself, check before shipping`);

// 4. Logo files the app loads by URL (favicon, preview page logo).
cpSync(path.join(HERE, "public"), path.join(FRONT, "public"), { recursive: true });
console.log("ds-brand: copied logo + favicon files");
