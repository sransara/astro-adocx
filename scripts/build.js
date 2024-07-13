// @ts-check

// Run this script to build distributable files:
//   node ./scripts/build.js
//
// This script will:
//  - Runs from project root directory
//  - Run `node ./scripts/compile-rb.js ./src/patches/`
//  - Run `pnpm run tsc -b ./tsconfig.cjs.json ./tsconfig.esm.json`
//  - In dist/cjs/ rename all **/*.js files to .cjs (includeing subdirectories)

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @param {string} dirPath
 * @returns {string[]}
 */
function getAllFiles(dirPath) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  const result = [];
  for (const file of files) {
    const fullPath = path.resolve(dirPath, file.name);
    if (file.isDirectory()) {
      result.push(...getAllFiles(fullPath));
    } else {
      result.push(fullPath);
    }
  }
  return result;
};

function main() {
  const projectRoot = path.resolve(__dirname, '..');
  process.chdir(projectRoot);

  execSync('pnpm run compile-patches', { stdio: 'inherit' });
  execSync('pnpm run tsc -b ./tsconfig.cjs.json ./tsconfig.esm.json', { stdio: 'inherit' });

  console.log('Renaming dist/cjs/**/*.js files to .cjs');
  const cjsDistDir = path.resolve('./dist', 'cjs');
  for (const filePath of getAllFiles(cjsDistDir)) {
    if (filePath.endsWith('.js')) {
      const renamed = filePath.replace(/\.js$/, '.cjs');
      fs.renameSync(filePath, renamed);
    }
  }

  console.log('Done');
}

main();
