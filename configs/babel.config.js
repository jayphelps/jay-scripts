import { babelAddImportFileExtensionPlugin } from '../plugins/babel/babel-plugin-add-import-file-extension.js';

export default {
  presets: ['@babel/preset-typescript'],
  plugins: [
    '@babel/plugin-syntax-import-meta',
    babelAddImportFileExtensionPlugin,
  ],
  ignore: ['node_modules'],
};
