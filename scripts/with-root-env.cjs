const { spawnSync } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const rootEnvPath = resolve(__dirname, '..', '.env');

if (existsSync(rootEnvPath)) {
  const lines = readFileSync(rootEnvPath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error('Usage: node scripts/with-root-env.cjs <command> [...args]');
  process.exit(1);
}

const result = spawnSync(command, args, {
  env: process.env,
  shell: true,
  stdio: 'inherit'
});

process.exit(result.status ?? 1);
