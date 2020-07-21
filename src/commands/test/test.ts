import fs from 'fs-extra';
import path from 'path';
import url from 'url';
import crossSpawn from 'cross-spawn';
import pkgDir from 'pkg-dir';

import { runCommands } from '../../utils/runCommands';

function resolveBin(name: string) {
  return crossSpawn
    .sync('yarn', ['bin', name], { encoding: 'utf8' })
    .stdout.slice(0, -1); // remove trailing newline
}

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jestBinPath = resolveBin('jest');
const tscBinPath = resolveBin('tsc');

const tscCommand = `${tscBinPath} --project tsconfig.json --noEmit --emitDeclarationOnly false`;
const jestCommand = `${jestBinPath} --notify`;

export const commands = [babelEsmCommand, babelCjsCommand, tscCommand];

export default async function build(): Promise<void> {
  await runCommands([tscCommand]);
  await runCommands([babelEsmCommand, babelCjsCommand], { parallel: true });
  console.log('Built successfully to ./dist');
}
