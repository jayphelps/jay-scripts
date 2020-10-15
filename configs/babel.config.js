import { babelAddImportFileExtensionPlugin } from '../plugins/babel/babel-plugin-add-import-file-extension.js';

export default {
  presets: ['@babel/preset-typescript'],
  plugins: [
    // Webpack doesn't yet support class fields because acorn doesn't.
    // https://github.com/webpack/webpack/issues/10216
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-syntax-import-meta',
    babelAddImportFileExtensionPlugin,
  ],
  ignore: ['node_modules'],
};
