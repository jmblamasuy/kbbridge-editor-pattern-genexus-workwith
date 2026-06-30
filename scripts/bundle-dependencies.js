/**
 * Bundle the vendored @kbbridge/genexus-sdk into node_modules and out/node_modules.
 *
 * - node_modules/@kbbridge/genexus-sdk      → so `tsc` resolves the SDK during development.
 * - out/node_modules/@kbbridge/genexus-sdk  → so the packaged .vsix runs standalone.
 *
 * The SDK has no external dependencies, so this is the only thing that needs bundling.
 * If your extension later depends on other libraries, copy them here too.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const vendoredSdk = path.join(projectRoot, 'vendor', 'genexus-sdk');

const targets = [
  path.join(projectRoot, 'node_modules', '@kbbridge', 'genexus-sdk'),
  path.join(projectRoot, 'out', 'node_modules', '@kbbridge', 'genexus-sdk'),
];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

if (!fs.existsSync(vendoredSdk)) {
  console.error(`ERROR: vendored SDK not found at ${vendoredSdk}`);
  process.exit(1);
}

for (const target of targets) {
  copyDir(vendoredSdk, target);
  console.log(`  ✓ Bundled @kbbridge/genexus-sdk → ${path.relative(projectRoot, target)}`);
}

console.log('Done.');
