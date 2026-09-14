#!/usr/bin/env node
import { access, writeFile } from 'fs/promises';
import { constants as fsConstants } from 'fs';
import path from 'path';

const distServer = path.resolve(process.cwd(), 'dist', 'server');
const shimPath = path.join(distServer, 'server.js');

async function main() {
  try {
    await access(distServer, fsConstants.F_OK);
  } catch (err) {
    console.error('dist/server not found — run `npm run build` first.');
    process.exit(0);
  }

  const content = "export { default } from './index.js';\n";
  await writeFile(shimPath, content, 'utf8');
  console.log('Created shim:', shimPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
