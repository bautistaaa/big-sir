import { default as aboutThisDeveloperConfig } from './aboutThisDeveloper';
import { default as aboutThisMacConfig } from './aboutThisMac';
import { default as chromeConfig } from './chrome';
import { default as finderConfig } from './finder';
import { default as spotifyConfig } from './spotify';
import { default as terminalConfig } from './terminal';

export type AppType =
  | 'aboutThisMac'
  | 'aboutThisDeveloper'
  | 'chrome'
  | 'spotify'
  | 'terminal'
  | 'finder';
export interface WindowConfig {
  minWidth?: number;
  minHeight?: number;
  height: number;
  width: number;
  resizeable: boolean;
}

const configs: { [K in AppType]: WindowConfig } = {
  aboutThisDeveloper: aboutThisDeveloperConfig,
  aboutThisMac: aboutThisMacConfig,
  chrome: chromeConfig,
  finder: finderConfig,
  terminal: terminalConfig,
  spotify: spotifyConfig,
};

export default configs;
