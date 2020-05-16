import fs from 'fs';
import path from 'path';
import prompts from 'prompts';

import { runCommands } from '../../utils/runCommands';

// The order of the keys matters for aesthetic reasons.
// If a field ends up being 'undefined' in the end it'll be removed when
// we stringify it.
const packageJsonDefaults = {
  name: undefined,
  private: true,
  version: '0.0.0',
  description: '',
  author: 'Jay Phelps <hello@jayphelps.com>',
  license: 'MIT',
  homepage: undefined as undefined | string,
  bugs: undefined as
    | undefined
    | {
        url: string;
      },
  repository: undefined as
    | undefined
    | {
        type: 'git';
        url: string;
      },
  main: './dist/cjs/index.js',
  type: 'module',
  exports: {
    import: './dist/esm/index.js',
    require: './dist/cjs/index.js',
  },
  files: ['dist'],
  scripts: {
    start: 'jay-scripts start',
    build: 'jay-scripts build',
    test: 'jay-scripts test',
  },
  devDependencies: {
    '@jayphelps/jay-scripts': 'latest',
  },
};

const license = `MIT License

Copyright (c) ${new Date().getFullYear()}-present Jay Phelps, and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

const tsconfig = {
  extends: '@jayphelps/jay-scripts/configs/tsconfig.json',
};
const prettierconfig = `module.exports = {
  printWidth: 80,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
};
`;
const gitignore = `${['node_modules/', 'dist/'].join('\n')}\n`;
const indexts = 'console.log("hello world!");\n';

async function createProject(name: string) {
  // If an @namespace isn't used this just returns the original unmodified.
  const nameWithoutNamespace = name.replace(/^@\S+\/(\S+)$/, '$1');

  const { version } = await prompts({
    name: 'version',
    type: 'text',
    message: 'version:',
    validate: (value: string) => {
      // Naive cause I don't need it more complex.
      return !!value.match(/^[0-9]\.[0-9]\.[0-9]$/);
    },
    initial: '0.0.0',
  });

  const { description } = await prompts({
    name: 'description',
    type: 'text',
    message: 'description:',
    initial: '',
  });

  const { github } = await prompts({
    name: 'github',
    type: 'text',
    message: 'org/username:',
    initial: `jayphelps/${nameWithoutNamespace}`,
  });

  const packageJson = { ...packageJsonDefaults };

  // This is done this way instead of spreading so that the key order is still
  // the same when it's stringified to JSON!
  Object.assign(packageJson, { name, version, description });

  if (github) {
    packageJson.repository = {
      type: 'git',
      url: `git+https://github.com/${github}.git`,
    };

    packageJson.bugs = {
      url: `https://github.com/${github}/issues`,
    };

    packageJson.homepage = `https://github.com/${github}/`;
  }

  const projectDirPath = path.resolve(nameWithoutNamespace);

  /* /project */
  fs.mkdirSync(projectDirPath);
  fs.writeFileSync(
    path.join(projectDirPath, 'package.json'),
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(projectDirPath, 'tsconfig.json'),
    `${JSON.stringify(tsconfig, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(projectDirPath, 'prettier.config.js'),
    prettierconfig,
  );
  fs.writeFileSync(path.join(projectDirPath, '.gitignore'), gitignore);
  fs.writeFileSync(path.join(projectDirPath, 'README.md'), `# ${name}\n`);
  fs.writeFileSync(path.join(projectDirPath, 'LICENSE'), license);

  /* /project/src */
  fs.mkdirSync(path.join(projectDirPath, 'src'));
  fs.writeFileSync(path.join(projectDirPath, 'src', 'index.ts'), indexts);

  /* /project/types */
  fs.mkdirSync(path.join(projectDirPath, 'types'));

  const finalizeCmd = [
    `cd "${projectDirPath}"`,
    'yarn',
    'yarn build',
    'node .',
    `code .`,
  ].join(' && ');

  await runCommands([finalizeCmd]);

  console.log(`Created project '${name}' in ${nameWithoutNamespace}/`);
}

export default async function create(name: string): Promise<void> {
  try {
    await createProject(name);
  } catch (e) {
    console.error(e);
    console.log('Creating a new project failed.');
    process.exit(1);
  }
}
