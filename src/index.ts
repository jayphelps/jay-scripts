import commander from 'commander';
import fs from 'fs';
import path from 'path';
import url from 'url';

import { CommandConfig } from './CommandConfig';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMMANDS_DIR = path.resolve(__dirname, 'commands');
const COMMANDS_DIR_URL = url.pathToFileURL(COMMANDS_DIR).href;

export async function main(argv: string[]) {
  const program = new commander.Command();
  program.name('jay-scripts');

  const dirs = fs
    .readdirSync(COMMANDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const dir of dirs) {
    const configExports = await import(
      `${COMMANDS_DIR_URL}/${dir.name}/index.js`
    );
    const config = configExports.default as CommandConfig;

    const command = program
      .command(config.command)
      .description(config.description);

    config.options
      .reduce((command, option) => {
        if (option.required) {
          return command.requiredOption(
            option.flag,
            option.description,
            option.default,
          );
        } else {
          return command.option(
            option.flag,
            option.description,
            option.default,
          );
        }
      }, command)
      .action(async (...args) => {
        // The command actions are setup to be lazy because we want the cli
        // to start up as quickly as possible, not importing a ton of unused
        // dependencies every time.
        const { default: action } = await import(
          `${COMMANDS_DIR_URL}/${dir.name}/${dir.name}.js`
        );
        await action(...args);
      });
  }

  program.parse(argv);
}
