/**
 * TODO: this file is regular JavaScript, not TypeScript, because it needs
 * to be imported by babel.config.js for now. We should extrac this as another
 * monorepo package and have it built separately so we can use TypeScript for
 * consistency sake.
 */

export function transformSource(t, path) {
  const source = path.get('source');
  // It's not re-export, it's a local declaration
  if (!source.node) {
    return;
  }

  let sourceValue = source.node.value;

  const relativeRegex = /^[./]/;
  const extensionRegex = /\/([^.])*$/;
  if (sourceValue.match(relativeRegex) && sourceValue.match(extensionRegex)) {
    if (sourceValue.endsWith('/')) {
      sourceValue += 'index';
    }
    source.replaceWith(t.stringLiteral(`${sourceValue}.js`));
  }
}

export function babelAddImportFileExtensionPlugin(babel, opts) {
  const { types: t } = babel;

  return {
    name: 'jay-scripts:babel-plugin-add-import-file-extension',
    visitor: {
      ImportDeclaration(path) {
        transformSource(t, path);
      },
      ExportAllDeclaration(path) {
        transformSource(t, path);
      },
      ExportNamedDeclaration(path) {
        transformSource(t, path);
      },
    },
  };
}
