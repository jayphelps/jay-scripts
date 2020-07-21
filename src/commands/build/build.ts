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

const configsPath = path.resolve(pkgDir.sync(__dirname)!, 'configs');
const distPath = path.join('dist');
const esmConfigPath = path.join(configsPath, 'babel.config.js');
const esmDistPath = path.join('dist', 'esm');
const cjsConfigPath = path.join(configsPath, 'babel.config.cjs.js');
const cjsDistPath = path.join('dist', 'cjs');
const babelBinPath = resolveBin('babel');
const tscBinPath = resolveBin('tsc');
const babelCommand = `${babelBinPath} src --source-maps --extensions .js,.ts,.jsx,.tsx`;

export const babelEsmCommand = `${babelCommand} --out-dir ${esmDistPath} --config-file "${esmConfigPath}"`;
export const babelCjsCommand = `${babelCommand} --out-dir ${cjsDistPath} --config-file "${cjsConfigPath}"`;
export const tscCommand = `${tscBinPath} --project tsconfig.json --declarationDir "${cjsDistPath}"`;

export const commands = [babelEsmCommand, babelCjsCommand, tscCommand];

export default async function build(): Promise<void> {
  if (fs.existsSync(distPath)) {
    fs.removeSync(distPath);
  }

  fs.mkdirSync(distPath);
  fs.mkdirSync(cjsDistPath);

  // This is first so that if type check fails we don't actually build
  await runCommands([tscCommand]);
  await runCommands([babelEsmCommand, babelCjsCommand], { parallel: true });
  console.log('Built successfully to ./dist');
}
