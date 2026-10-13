import cors from 'cors';
import express, { Express, Response } from 'express';
import { FournisseurChemin } from '../fournisseurChemin.js';
import { enregistreRouteDansExpress } from './enregistreRoutes.js';

const sertLesFichiersStatiques = (
  fournisseurChemin: FournisseurChemin['jekyll']['assets' | 'scripts' | 'libSvelte' | 'favicon']
) =>
  express.static(fournisseurChemin(), {
    setHeaders: (réponse: Response) => {
      réponse.setHeader('cache-control', process.env.CACHE_CONTROL_FICHIERS_STATIQUES || 'no-store');
      réponse.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  });

export const enregistreLesFichiersStatiques = (app: Express, fournisseurChemin: FournisseurChemin) => {
  const enregistreRoute = enregistreRouteDansExpress(app);
  enregistreRoute(`/assets`, cors(), sertLesFichiersStatiques(fournisseurChemin.jekyll.assets));
  enregistreRoute('/scripts', sertLesFichiersStatiques(fournisseurChemin.jekyll.scripts));
  enregistreRoute('/lib-svelte', sertLesFichiersStatiques(fournisseurChemin.jekyll.libSvelte));
  enregistreRoute('/favicon.ico', sertLesFichiersStatiques(fournisseurChemin.jekyll.favicon));
};
