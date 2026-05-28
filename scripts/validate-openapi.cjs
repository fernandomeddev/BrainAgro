const fs = require('node:fs');
const yaml = require('js-yaml');

const file = process.argv[2] ?? 'docs/openapi.yaml';
const document = yaml.load(fs.readFileSync(file, 'utf8'));
const refs = [];

function walk(value) {
  if (!value || typeof value !== 'object') return;
  if (value.$ref) refs.push(value.$ref);
  for (const child of Object.values(value)) walk(child);
}

function resolveRef(ref) {
  if (!ref.startsWith('#/')) return null;
  return ref
    .replace('#/', '')
    .split('/')
    .reduce((current, part) => (current ? current[part] : undefined), document);
}

walk(document);

const missingRefs = refs.filter((ref) => !resolveRef(ref));
const summary = {
  openapi: document.openapi,
  title: document.info?.title,
  version: document.info?.version,
  paths: Object.keys(document.paths ?? {}).length,
  schemas: Object.keys(document.components?.schemas ?? {}).length,
  refs: refs.length,
  missingRefs
};

console.log(JSON.stringify(summary, null, 2));

if (!document.openapi || !document.paths || !document.components) {
  throw new Error('OpenAPI document is missing required top-level sections.');
}

if (missingRefs.length > 0) {
  throw new Error(`OpenAPI document has unresolved refs: ${missingRefs.join(', ')}`);
}
