import baseConfig from './babel.config.js';

export default {
  ...baseConfig,
  plugins: [...baseConfig.plugins, '@babel/plugin-transform-modules-commonjs'],
};
