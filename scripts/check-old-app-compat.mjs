#!/usr/bin/env node
// check-old-app-compat.mjs — will this keyguard.scad still work in the RETIRED app?
//
// WHY
// ---
// The old address is frozen at release 21 until 1 August 2027, but keyguard.scad
// keeps moving, and release 21 still asks GitHub for keyguard updates. So a
// straggler who never saved their settings can pull a keyguard version far newer
// than the app they are running — and we have no way to send them a fix, because
// the old address is deliberately never released again (Ken, 1 Sep 2026).
//
// This checks the contract in old-app-contract.json before that can happen. It runs
// as a preflight inside release-designer.mjs, so a keyguard version that release 21
// cannot drive fails the release BEFORE the push, while it is still cheap to fix.
//
// It is a conservative check, and deliberately so: it fails only on things release
// 21 genuinely reaches for by name. It cannot prove a keyguard renders correctly in
// an old app — only that the wiring release 21 depends on is still present.
//
//   node scripts/check-old-app-compat.mjs            -> checks the .scad working copy
//   node scripts/check-old-app-compat.mjs <file>     -> checks a specific file
//
// Exit 0 = compatible (warnings may still print). Exit 1 = would break release 21.

import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB_ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SCAD_ROOT = process.env.KEYGUARD_DESIGNER_ROOT
  || resolve(WEB_ROOT, '..', 'My SCAD files', 'keyguard designer');

const scadPath = process.argv[2] || join(SCAD_ROOT, 'keyguard.scad');
const contract = JSON.parse(readFileSync(join(WEB_ROOT, 'old-app-contract.json'), 'utf8'));

let scad;
try {
  scad = readFileSync(scadPath, 'utf8');
} catch (e) {
  console.error(`check-old-app-compat: cannot read ${scadPath}\n  ${e.message}`);
  process.exit(1);
}

const failures = [];
const warnings = [];

// A top-level declaration: `name = ...` at the start of a line. That is how the app
// finds parameters too, so matching its shape is the point.
const declares = name => new RegExp(`^\\s*${name}\\s*=`, 'm').test(scad);

for (const name of contract.required.parameters.names) {
  if (!declares(name)) {
    failures.push(`parameter "${name}" is gone — release 21 injects it with -D on every render, `
      + `so its renders would silently use the wrong value.`);
  }
}

for (const name of contract.required.declarations.names) {
  if (!declares(name)) failures.push(`declaration "${name}" is gone — release 21 reads it to show the version and to decide whether an update is newer.`);
}

// The echo line the app parses for screenshot sizing and camera placement.
const echoLine = scad.split('\n').find(l => l.includes(contract.required.echo.marker));
if (!echoLine) {
  failures.push(`the "${contract.required.echo.marker}" echo is gone — release 21 sizes the screenshot `
    + `plane and places the camera from it, so its viewport would break, not just a readout.`);
} else {
  // Fields may wrap onto continuation lines; search the whole statement.
  const start = scad.indexOf(echoLine);
  const stmt = scad.slice(start, scad.indexOf(';', start) + 1);
  for (const f of contract.required.echo.fields) {
    if (!new RegExp(`\\b${f}\\s*=`).test(stmt)) {
      failures.push(`the ${contract.required.echo.marker} echo no longer reports "${f}" — release 21 reads that field.`);
    }
  }
}

// Values release 21 sends or tests for by name must still be offered by the
// parameter's Customizer option list.
for (const [param, values] of Object.entries(contract.required.option_values)) {
  if (param.startsWith('_')) continue;
  const line = scad.split('\n').find(l => new RegExp(`^\\s*${param}\\s*=`).test(l));
  if (!line) continue;                      // already reported as a missing parameter
  const opts = line.match(/\[([^\]]*)\]/);
  if (!opts) {
    warnings.push(`could not read the option list for "${param}" — skipped its value check.`);
    continue;
  }
  const offered = opts[1].split(',').map(s => s.trim());
  for (const v of values) {
    if (!offered.includes(v)) {
      failures.push(`"${param}" no longer offers "${v}" — release 21 asks for it by name.`);
    }
  }
}

for (const name of contract.advisory.parameters.names) {
  if (!declares(name)) warnings.push(`parameter "${name}" is gone — release 21 loses a help hint. Not a break.`);
}

// ─── Report ────────────────────────────────────────────────────────────────

const version = scad.match(/keyguard_designer_version\s*=\s*(\d+)/)?.[1] ?? '?';
console.log(`Checking keyguard.scad v${version} against retired app release 21…`);

for (const w of warnings) console.log(`  warning: ${w}`);

if (failures.length) {
  console.error(`${'\n'}INCOMPATIBLE with release 21 — ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error(`${'\n'}Clinicians still on the OLD address would be offered this version and could`);
  console.error(`accept it, leaving them with a keyguard file their frozen app cannot drive —`);
  console.error(`and that address is never released again, so they could not be sent a fix.`);
  console.error(`${'\n'}Either keep the contract (see old-app-contract.json), or decide deliberately`);
  console.error(`to break it — in which case the old app must stop offering keyguard updates`);
  console.error(`first, which is a release to the retired address.`);
  process.exit(1);
}

console.log(`  compatible — all ${contract.required.parameters.names.length} injected parameters, `
  + `the ${contract.required.echo.marker} echo and its ${contract.required.echo.fields.length} fields, `
  + `and every hardcoded option value are intact.`);
