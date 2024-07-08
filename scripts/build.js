import { execSync } from 'node:child_process';
import { copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const distDir = resolve(projectRoot, 'dist');

process.chdir(projectRoot);
execSync('node ./scripts/compile-rb.js ./src/patches/');
execSync('npm run tsc');
for (const file of ['package.json', 'README.md', 'LICENSE']) {
    const projectFile = resolve(projectRoot, file);
    const distFile = resolve(distDir, file);
    copyFileSync(projectFile, distFile);
}
