#!/usr/bin/env node
// publish-scad-version.mjs — regenerate latest_scad_version.json from the
// current keyguard.scad. Trigger phrase: "publish scad version".
//
// Reads keyguard_designer_version from the .scad source repo's keyguard.scad and
// writes the manifest the web app fetches to offer clinicians an in-app update.
// The `notes` shown in the update dialog are sourced VERBATIM from the .scad
// project's CHANGELOG.md — from the "## Version N" section if it has been renamed
// at release, otherwise from the in-development "## Unreleased (next release)"
// section (the release ritual renames Unreleased -> "## Version N", so before that
// the notes live under Unreleased). So the dialog ALWAYS lists the clinician-visible
// changes for the version being offered, and ONLY what the (clinician-facing)
// changelog says. Missing / placeholder-only notes are a hard error: never advertise
// a version whose clinician notes haven't been written yet.
//
// Run this at PUBLISH time — i.e. when the keyguard.scad on disk is the one you
// are pushing to Volksswitch/keyguard (main).

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));      // web-app repo root
// Sibling .scad project — resolves on both machines via OneDrive (Windows is
// case-insensitive, so .../Keyguard/../My SCAD files lands in the right place).
const designerRoot  = join(root, '..', 'My SCAD files', 'keyguard designer');
const scadPath      = join(designerRoot, 'keyguard.scad');
const changelogPath = join(designerRoot, 'CHANGELOG.md');
const outPath       = join(designerRoot, 'latest_scad_version.json');

const scad = readFileSync(scadPath, 'utf8');
const m = scad.match(/keyguard_designer_version\s*=\s*(\d+)/);
if (!m) {
  console.error(`ERROR: keyguard_designer_version not found in ${scadPath}`);
  process.exit(1);
}
const version = parseInt(m[1], 10);

// Pull the clinician-visible changes straight from CHANGELOG.md so they can
// never drift from the changelog or silently fall back to a placeholder.
const notes = extractChangelogBullets(readFileSync(changelogPath, 'utf8'), version);
if (notes.length === 0) {
  console.error(`ERROR: no "## Version ${version}" or "## Unreleased (next release)" section with`);
  console.error(`real bullet points found in ${changelogPath}. Write the clinician-visible changes`);
  console.error(`for v${version} there first (the "_In development._" placeholder does not count).`);
  process.exit(1);
}

const manifest = {
  version,
  scad_filename: `keyguard_v${version}.scad`,
  scad_url: 'https://raw.githubusercontent.com/Volksswitch/keyguard/main/keyguard.scad',
  notes,            // array of clinician-visible change strings (one per changelog bullet)
};

writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${outPath}\n`);
console.log(JSON.stringify(manifest, null, 2));
console.log(`\nNext: commit & push latest_scad_version.json to Volksswitch/keyguard (main),`);
console.log(`and make sure keyguard.scad on main is the v${version} this manifest names.`);

// Returns the clinician-visible bullet lines for this version: from "## Version
// <version>" if that heading exists (renamed at release), otherwise from the
// in-development "## Unreleased (next release)" section. Italic-only placeholders
// (e.g. "_In development._") are skipped, so an un-started cycle yields no notes.
function extractChangelogBullets(changelog, version) {
  const fromVersion = bulletsUnder(changelog, (line) => {
    const h = line.match(/^##\s+Version\s+(\d+)/i);
    return h && parseInt(h[1], 10) === version;
  });
  if (fromVersion.length) return fromVersion;
  return bulletsUnder(changelog, (line) => /^##\s+Unreleased\b/i.test(line));
}

// Collects the bullet lines under the first heading `headingMatches` accepts, up to
// the next "## " heading, trimmed of their leading "- "/"* " marker. Italic-only
// placeholder bullets (wrapped in _underscores_) are skipped.
function bulletsUnder(changelog, headingMatches) {
  const bullets = [];
  let inSection = false;
  for (const line of changelog.split('\n')) {
    if (/^##\s+/.test(line)) {
      if (inSection) break;                       // hit the next section — done
      inSection = headingMatches(line);
      continue;
    }
    if (!inSection) continue;
    const b = line.match(/^\s*[-*]\s+(.*\S)\s*$/);
    if (b && !/^_.*_$/.test(b[1].trim())) bullets.push(b[1].trim());
  }
  return bullets;
}
