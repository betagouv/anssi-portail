import { resolve } from 'node:path';
import { defineConfig, loadConfigFromFile, mergeConfig } from 'vite';

import { aliasSvelte } from './alias.plugin.js';

export default defineConfig(async (environnement) => {
  const chemin = resolve('vite.config.ts');
  const configuration = await loadConfigFromFile(environnement, chemin);
  if (!configuration) throw new Error('Configuration Vite introuvable : ' + chemin);

  return mergeConfig(configuration.config, { plugins: [aliasSvelte()] });
});
