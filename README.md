# @jayphelps/jay-scripts

A collection of common scripts for my personal projects. Not intended to be used by others as I'll likely make frequent breaking changes without warning. Open source in case it's useful as a reference, and also why not.


## Notes

  - This project is self-hosted; it was bootstraped and is built using an older version of itself.
  - The CLI itself uses native ES Modules in Node, so it requires a fairly recent version. But it still compiles the consuming project to both ESM/CJS, setting up the package.json appropriately.

## Commands

### Create

```bash
npx @jayphelps/jay-scripts create my-project-name
cd my-project-name
```

### Start

```bash
yarn start
# or
npx jay-scripts start
```

### Build

```bash
yarn build
# or
npx jay-scripts build
```
