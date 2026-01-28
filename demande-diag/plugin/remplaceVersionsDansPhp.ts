import * as fs from 'node:fs';
import path from 'path';
import * as Vite from 'vite';

export const remplaceVersionsDansPhp = (
  versionUiKit: string,
  version: string,
  env: string
): Vite.Plugin => {
  let configurationResolue: Vite.ResolvedConfig;

  const remplace = (source: string) => {
    return source
      .replaceAll('<VERSION_UI_KIT>', versionUiKit)
      .replaceAll('<VERSION>', version)
      .replaceAll('<ENV>', env);
  };

  return {
    name: 'remplace-version-php',
    enforce: 'post',
    configResolved(configuration) {
      configurationResolue = configuration;
    },
    closeBundle() {
      const chemin = path.resolve(
        configurationResolue.publicDir,
        'demande-diag.php'
      );
      const contenu = remplace(fs.readFileSync(chemin, 'utf-8'));
      const cheminSortie = path.resolve(
        configurationResolue.root,
        configurationResolue.build.outDir,
        'demande-diag.php'
      );
      fs.writeFileSync(cheminSortie, contenu);
      console.info(
        `Fichier ${cheminSortie} écrit avec [VERSION_UI_KIT=${versionUiKit}] [VERSION=${version}] [ENV=${env}]`
      );
    },
  };
};
