import { CommandConfig } from '../../CommandConfig';

export default {
  command: 'build',
  description: 'TODO',
  options: [
    {
      flag: '-p, --pizza-type <number>',
      description: 'I like pizza',
      required: false,
      default: 'cheese'
    }
  ]
} as CommandConfig;
