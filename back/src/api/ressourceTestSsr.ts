import { Router } from 'express';
import fs from 'node:fs';
import { render } from 'svelte/server';
import { ConfigurationServeur } from './configurationServeur';
import { corpsVide, valideCorpsRequete } from './zod';

export const ressourceTestSsr = ({ fournisseurChemin }: ConfigurationServeur) => {
  const router = Router();
  router.get('/', valideCorpsRequete(corpsVide), async (_req, reponse) => {
    const pageJekyll = fournisseurChemin.cheminPageJekyll('entreprises');
    const fichier = fs.readFileSync(pageJekyll, 'utf-8');

    const composants = [...fichier.matchAll(/<div id="(.*)"><\/div>/g)].map((e) => e[1]);

    let résultat = fichier;
    let tousLesHead = '';

    for (const nomComposant of composants) {
      try {
        const composant = await import('../../../front/lib-svelte/dist/assets/' + nomComposant + '.js');
        const { body, head } = render(composant.default);
        console.log('injection ' + nomComposant);
        résultat = résultat.replaceAll(`<div id="${nomComposant}"></div>`, `<div id="${nomComposant}">${body}</div>`);
        tousLesHead += head;
      } catch (e) {
        console.error((e as Error).message);
      }
    }

    résultat = résultat.replaceAll('<head>', `<head>${tousLesHead}`);
    reponse.send(résultat);
  });
  return router;
};
