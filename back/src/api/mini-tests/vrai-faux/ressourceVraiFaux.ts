import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

export const ressourceVraiFaux = () => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete, reponse) => {
      reponse.status(HttpStatusCode.Ok).send([
        {
          idQuestion: 'idQuestion1',
          libellé: {
            emoji: '🏢',
            texte: 'Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.',
          },
          idéeReçue:
            'FAUX. Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.',
          explications: `
Les PME, TPE et ETI sont la catégorie la plus touchée.
En 2025, parmi les victimes d'attaques par rançongiciel portées à la connaissance de l'ANSSI, les PME, TPE et ETI représentent 37 % des cas — c'est la catégorie la plus affectée. Les attaques cybercriminelles ciblent indistinctement la plupart des secteurs et zones géographiques, de façon opportuniste.
`,
          source: 'ANSSI, Panorama de la cybermenace 2025, section 1.A — pages 10-11.',
          estVraie: false,
        },
      ]);
    })
  );
  return routeur;
};
