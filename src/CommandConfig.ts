export interface CommandConfigOption {
  flag: string;
  description: string;
  required?: boolean;
  default?: string;
}

export interface CommandConfig {
  command: string;
  description: string;
  options: CommandConfigOption[];
}
