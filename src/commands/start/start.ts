import { runCommands } from '../../utils/runCommands';
import { commands } from '../build/build';

export default async function start(): Promise<void> {
  const watchCommands = commands.map((cmd) => `${cmd} --watch`);
  await runCommands(watchCommands, { parallel: true });
}
