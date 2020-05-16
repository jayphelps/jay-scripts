import { CommandConfig } from '../../CommandConfig';

export default {
  command: 'build',
  description: 'Typecheck and build the project, writing to ./dist/{cjs,esm}',
  options: [],
} as CommandConfig;
