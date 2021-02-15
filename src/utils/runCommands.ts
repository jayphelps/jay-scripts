import npmRun from 'npm-run';

function spawnWithPromise(cmd: string) {
  return new Promise<string>((resolve, reject) => {
    npmRun(cmd, {}, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(stdout.toString());
    });
  });
}

export async function runCommands(
  cmds: string[],
  options: { parallel: boolean } = { parallel: false },
) {
  if (options.parallel) {
    const childProcesses = cmds.map((cmd) => spawnWithPromise(cmd));
    await Promise.all(childProcesses);
  } else {
    for (const cmd of cmds) {
      await spawnWithPromise(cmd);
    }
  }
}
