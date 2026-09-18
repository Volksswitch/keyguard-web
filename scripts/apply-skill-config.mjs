#!/usr/bin/env node
// Reads skill-config.txt and injects the parsed config into app.html.
// Usage: node scripts/apply-skill-config.mjs

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const configPath = join(root, 'skill-config.txt');
const appPath    = join(root, 'app.html');

// ── Parse skill-config.txt ──────────────────────────────────────────────────

const raw = readFileSync(configPath, 'utf8');
const lines = raw.split('\n');

const descs = {};         // { beginner: '...', intermediate: '...', advanced: '...' }
const sections = {};      // { 'Section Name': 'level', ... }
const params = {};        // { 'param_name': 'level', ... }
const dropdownOptions = {};  // { 'param_name': { 'option': 'level', ... }, ... }
const dropdownFilters = {};  // { 'param_name': [{ pattern, level }, ...], ... }
const hiddenParams = [];     // ['param_name', ...]

let currentBlock = 'top';   // 'top' | 'sections' | 'params' | 'dropdown:X' | 'filter:X' | 'hidden'

for (const rawLine of lines) {
  const line = rawLine.trim();
  if (line === '' || line.startsWith('#')) continue;

  // Section header: [sections], [params], [dropdown: param_name], [filter: param_name]
  const headerMatch = line.match(/^\[(.+)\]$/);
  if (headerMatch) {
    const hdr = headerMatch[1].trim();
    if (hdr === 'sections' || hdr === 'params' || hdr === 'hidden') {
      currentBlock = hdr;
    } else {
      const ddMatch = hdr.match(/^dropdown:\s*(.+)$/i);
      if (ddMatch) {
        const paramName = ddMatch[1].trim();
        currentBlock = `dropdown:${paramName}`;
        dropdownOptions[paramName] = dropdownOptions[paramName] || {};
      } else {
        const fMatch = hdr.match(/^filter:\s*(.+)$/i);
        if (!fMatch) throw new Error(`Unrecognised section header: [${hdr}]`);
        const paramName = fMatch[1].trim();
        currentBlock = `filter:${paramName}`;
        dropdownFilters[paramName] = dropdownFilters[paramName] || [];
      }
    }
    continue;
  }

  // [hidden] entries are bare names with no "= value"
  if (currentBlock === 'hidden') {
    hiddenParams.push(line);
    continue;
  }

  // Key = value line
  const eqIdx = line.indexOf('=');
  if (eqIdx < 0) throw new Error(`Expected "key = value" but got: ${line}`);
  const key   = line.slice(0, eqIdx).trim();
  const value = line.slice(eqIdx + 1).trim();

  if (currentBlock === 'top') {
    if (!['beginner', 'intermediate', 'advanced'].includes(key)) {
      throw new Error(`Unknown description key "${key}". Expected beginner, intermediate, or advanced.`);
    }
    descs[key] = value;
  } else if (currentBlock === 'sections') {
    sections[key] = value;
  } else if (currentBlock === 'params') {
    params[key] = value;
  } else if (currentBlock.startsWith('dropdown:')) {
    const paramName = currentBlock.slice('dropdown:'.length);
    dropdownOptions[paramName][key] = value;
  } else {
    const paramName = currentBlock.slice('filter:'.length);
    dropdownFilters[paramName].push({ pattern: key, level: value });
  }
}

const REQUIRED_DESCS = ['beginner', 'intermediate', 'advanced'];
for (const k of REQUIRED_DESCS) {
  if (!descs[k]) throw new Error(`Missing description for skill level "${k}"`);
}

// ── Generate JS replacement blocks ─────────────────────────────────────────

function jsStr(s) {
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function jsObj(map, indent = '  ') {
  const entries = Object.entries(map);
  if (entries.length === 0) return '{}';
  const lines = entries.map(([k, v]) => `${indent}  ${jsStr(k)}: ${jsStr(v)},`);
  return `{\n${lines.join('\n')}\n${indent}}`;
}

const descBlock = [
  '// @@SKILL_LEVEL_DESCS_START@@',
  'const SKILL_LEVEL_DESCS = {',
  `  beginner:     ${jsStr(descs.beginner)},`,
  `  intermediate: ${jsStr(descs.intermediate)},`,
  `  advanced:     ${jsStr(descs.advanced)},`,
  '};',
  '// @@SKILL_LEVEL_DESCS_END@@',
].join('\n');

const ddEntries = Object.entries(dropdownOptions).map(([param, opts]) => {
  const inner = Object.entries(opts).map(([k, v]) =>
    `      ${jsStr(k)}: ${jsStr(v)},`
  ).join('\n');
  return `    ${jsStr(param)}: {\n${inner}\n    },`;
});

const dfEntries = Object.entries(dropdownFilters).map(([param, rules]) => {
  const inner = rules.map(({ pattern, level }) =>
    `      { pattern: ${jsStr(pattern)}, level: ${jsStr(level)} },`
  ).join('\n');
  return `    ${jsStr(param)}: [\n${inner}\n    ],`;
});

const hiddenSet = hiddenParams.map(n => `    ${jsStr(n)},`);

const configBlock = [
  '// @@SKILL_CONFIG_START@@',
  'const SKILL_CONFIG = {',
  '  sections: ' + jsObj(sections, '  ') + ',',
  '  params: '   + jsObj(params,   '  ') + ',',
  '  dropdownOptions: {',
  ...ddEntries,
  '  },',
  '  dropdownFilters: {',
  ...dfEntries,
  '  },',
  '  hiddenParams: new Set([',
  ...hiddenSet,
  '  ]),',
  '};',
  '// @@SKILL_CONFIG_END@@',
].join('\n');

// ── Inject into app.html ────────────────────────────────────────────────────

let html = readFileSync(appPath, 'utf8');

function inject(src, startMarker, endMarker, replacement) {
  const start = src.indexOf(startMarker);
  const end   = src.indexOf(endMarker);
  if (start < 0) throw new Error(`Marker not found in app.html: ${startMarker}`);
  if (end   < 0) throw new Error(`Marker not found in app.html: ${endMarker}`);
  return src.slice(0, start) + replacement + src.slice(end + endMarker.length);
}

html = inject(html, '// @@SKILL_LEVEL_DESCS_START@@', '// @@SKILL_LEVEL_DESCS_END@@', descBlock);
html = inject(html, '// @@SKILL_CONFIG_START@@',      '// @@SKILL_CONFIG_END@@',      configBlock);

writeFileSync(appPath, html, 'utf8');
console.log('app.html updated from skill-config.txt');
