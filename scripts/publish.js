// node script to
// 1. change to project root directory
// 2. run `npm run build`
// 3. change to `dist` directory
// 4. copy `package.json` file to `dist` directory
// 4. copy `README.md` and `LICENSE` files to `dist` directory
// 5. run `npm publish` in `dist` directory

import { execSync } from 'node:child_process';
import { copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const distDir = resolve(projectRoot, 'dist');

process.chdir(projectRoot);
execSync('npm run build');
process.chdir(distDir);
for (const file of ['package.json', 'README.md', 'LICENSE']) {
    const projectFile = resolve(projectRoot, file);
    const distFile = resolve(distDir, file);
    copyFileSync(projectFile, distFile);
}
execSync('npm publish --access=public');
