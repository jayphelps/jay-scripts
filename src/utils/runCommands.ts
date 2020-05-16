import crossSpawn from 'cross-spawn';

const unixShell = {
  shell: process.env.SHELL || 'sh',
  flag: '-c',
};

const win32Shell = {
  shell: process.env.SHELL || 'cmd',
  flag: '/c',
};

const { shell, flag } = process.platform === 'win32' ? win32Shell : unixShell;

function spawnWithPromise(cmd: string) {
  return new Promise((resolve, reject) => {
    const childProcess = crossSpawn(shell, [flag, cmd], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['inherit', 'inherit', 'inherit'],
    });

    childProcess.once('exit', (code, signal) => {
      if (code !== null && code !== 0) {
        reject(new Error(`Exited with code ${code}, signal: ${signal}`));
        return;
      }
      resolve();
    });

    childProcess.once('error', (err) => {
      reject(err);
    });
  });
}

export async function runCommands(
  cmds: string[],
  options: { parallel: boolean } = { parallel: false }
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
