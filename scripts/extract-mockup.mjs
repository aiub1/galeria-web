#!/usr/bin/env node
// Extracts reference material from docs/design/mockups.html — a self-contained
// bundle produced by the design tool: a base64(+gzip) asset manifest plus a
// JSON-encoded HTML template. Output goes to docs/design/extracted/ and is
// reference material for the next phases, not production code.
//
// Bundle shape (see the bundle's own inline loader script for the full
// protocol): a `script[type="__bundler/manifest"]` tag holds a JSON object
// of `uuid -> { mime, compressed, data(base64) }`; a
// `script[type="__bundler/template"]` tag holds the page HTML as a JSON
// string, with asset uuids substituted inline as placeholders.
//
// The Poiema design system itself ships as ONE manifest entry
// (mime "application/javascript", marked with a "@ds-bundle" header comment)
// that concatenates every component under a `// <sourcePath>` marker per
// component — not as one manifest entry per component. Everything else
// (React/ReactDOM, Babel standalone, the lucide icon set, an unrelated
// "iOS device frame" starter component, and font/woff2 files) is bundler
// runtime or unrelated scaffolding and is skipped.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const mockupPath = path.join(repoRoot, "docs/design/mockups.html");
const outDir = path.join(repoRoot, "docs/design/extracted");

function extractScriptTag(html, type) {
  const marker = `<script type="${type}">`;
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const contentStart = start + marker.length;
  const end = html.indexOf("</script>", contentStart);
  if (end === -1) return null;
  return html.slice(contentStart, end);
}

function decodeEntry(entry) {
  const bytes = Buffer.from(entry.data, "base64");
  return entry.compressed ? gunzipSync(bytes) : bytes;
}

function extractDesignSystemComponents(bundleText, designSystemDir) {
  // Each component is preceded by a `// <sourcePath>` marker, e.g.
  // "// components/core/Button.jsx". Only "components/**" is the reusable
  // design system; "ui_kits/**" in the same bundle are full example screens.
  const markerRe = /\/\/ (components\/[^\n]+\.jsx)\n/g;
  const markers = [...bundleText.matchAll(markerRe)];
  const written = [];

  for (let i = 0; i < markers.length; i++) {
    const [, sourcePath] = markers[i];
    const start = markers[i].index;
    const end = i + 1 < markers.length ? markers[i + 1].index : bundleText.length;
    const componentSource = bundleText.slice(start, end).trimEnd() + "\n";

    const outPath = path.join(designSystemDir, sourcePath);
    mkdirSync(path.dirname(outPath), { recursive: true });
    writeFileSync(outPath, componentSource, "utf8");
    written.push(sourcePath);
  }

  return written;
}

function extractTokenBlocks(template) {
  // Design tokens ship as several inline `<style>...</style>` blocks in the
  // <head> of the template (:root blocks, the [data-theme="inverse"] block,
  // and its @media (prefers-reduced-motion) companion) — not as a separate
  // CSS manifest asset. The template repeats screens (and with them, the
  // token styles) multiple times, so dedupe by exact text.
  const styleBlocks = [...template.matchAll(/<style>([^]*?)<\/style>/g)].map((m) => m[1].trim());
  const tokenBlocks = styleBlocks.filter(
    (block) => block.includes(":root") || block.includes('[data-theme="inverse"]')
  );

  return [...new Set(tokenBlocks)];
}

function main() {
  const html = readFileSync(mockupPath, "utf8");

  const manifestRaw = extractScriptTag(html, "__bundler/manifest");
  const templateRaw = extractScriptTag(html, "__bundler/template");
  if (!manifestRaw || !templateRaw) {
    throw new Error("mockups.html: missing __bundler/manifest or __bundler/template script tags");
  }

  const manifest = JSON.parse(manifestRaw);
  const template = JSON.parse(templateRaw);

  mkdirSync(outDir, { recursive: true });
  const brandDir = path.join(repoRoot, "public/brand");
  mkdirSync(brandDir, { recursive: true });

  // 1. Template HTML — readable reference, asset uuids left as placeholders.
  writeFileSync(path.join(outDir, "template.html"), template, "utf8");

  // 2. Design system components.
  const designSystemDir = path.join(outDir, "design-system");
  let componentFiles = [];
  const pngEntries = Object.entries(manifest).filter(([, e]) => e.mime === "image/png");
  let logoWritten = false;

  for (const [, entry] of Object.entries(manifest)) {
    if (entry.mime !== "application/javascript") continue;
    const text = decodeEntry(entry).toString("utf8");
    if (!text.startsWith("/* @ds-bundle:")) continue; // not the design system bundle
    componentFiles = extractDesignSystemComponents(text, designSystemDir);
  }

  // 3. Logo — the bundle carries a single image/png asset (fonts are
  // font/woff2 and are ignored); everything else is icons/UI as inline SVG.
  if (pngEntries.length === 1) {
    const [, entry] = pngEntries[0];
    writeFileSync(path.join(brandDir, "poiema-cwb.png"), decodeEntry(entry));
    logoWritten = true;
  }

  // 4. Design tokens.
  const tokenBlocks = extractTokenBlocks(template);
  if (tokenBlocks.length > 0) {
    writeFileSync(
      path.join(outDir, "tokens.source.css"),
      tokenBlocks.join("\n\n"),
      "utf8"
    );
  }

  console.log(`Design system components: ${componentFiles.length}`);
  for (const f of componentFiles) console.log(`  - ${f}`);
  console.log(`Token blocks (deduped): ${tokenBlocks.length}`);
  console.log(`Logo written: ${logoWritten}`);
  console.log(`Output: ${outDir}`);
}

main();
