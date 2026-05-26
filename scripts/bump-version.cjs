const { existsSync, readFileSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const rootDir = resolve(__dirname, '..');
const rootPackagePath = resolve(rootDir, 'package.json');
const lockfilePath = resolve(rootDir, 'package-lock.json');

const bumpType = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');

const bumpRules = {
  dev: 'next patch prerelease, ex: 0.1.0 -> 0.1.1-dev.0',
  fix: 'patch, ex: 0.1.0 -> 0.1.1',
  feature: 'minor, ex: 0.1.0 -> 0.2.0',
  release: 'major, ex: 0.1.0 -> 1.0.0'
};

if (!Object.hasOwn(bumpRules, bumpType)) {
  console.error(`Usage: npm run version -- <${Object.keys(bumpRules).join('|')}> [--dry-run]`);
  console.error('');
  console.error('Rules:');
  for (const [type, description] of Object.entries(bumpRules)) {
    console.error(`  ${type.padEnd(8)} ${description}`);
  }
  process.exit(1);
}

const rootPackage = readJson(rootPackagePath);
const workspacePaths = rootPackage.workspaces ?? [];
const packagePaths = [
  rootPackagePath,
  ...workspacePaths.map((workspacePath) => resolve(rootDir, workspacePath, 'package.json'))
].filter(existsSync);

const currentVersion = rootPackage.version;
const nextVersion = getNextVersion(currentVersion, bumpType);

if (isDryRun) {
  console.log(`${currentVersion} -> ${nextVersion}`);
  process.exit(0);
}

for (const packagePath of packagePaths) {
  const packageJson = readJson(packagePath);
  packageJson.version = nextVersion;
  writeJson(packagePath, packageJson);
}

if (existsSync(lockfilePath)) {
  const lockfile = readJson(lockfilePath);
  lockfile.version = nextVersion;

  if (lockfile.packages?.['']) {
    lockfile.packages[''].version = nextVersion;
  }

  for (const workspacePath of workspacePaths) {
    const packageEntry = lockfile.packages?.[workspacePath.replace(/\\/g, '/')];
    if (packageEntry) {
      packageEntry.version = nextVersion;
    }
  }

  writeJson(lockfilePath, lockfile);
}

console.log(`Version updated: ${currentVersion} -> ${nextVersion}`);

function getNextVersion(version, type) {
  const parsed = parseVersion(version);

  if (type === 'dev') {
    if (parsed.prereleaseName === 'dev') {
      return `${parsed.major}.${parsed.minor}.${parsed.patch}-dev.${parsed.prereleaseNumber + 1}`;
    }

    return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}-dev.0`;
  }

  if (type === 'fix') {
    const patch = parsed.prereleaseName ? parsed.patch : parsed.patch + 1;
    return `${parsed.major}.${parsed.minor}.${patch}`;
  }

  if (type === 'feature') {
    return `${parsed.major}.${parsed.minor + 1}.0`;
  }

  return `${parsed.major + 1}.0.0`;
}

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z][\w-]*)\.(\d+))?$/.exec(version);

  if (!match) {
    throw new Error(`Invalid SemVer version: ${version}`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prereleaseName: match[4] ?? null,
    prereleaseNumber: match[5] === undefined ? -1 : Number(match[5])
  };
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}
