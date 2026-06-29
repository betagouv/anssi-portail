import { Response, Router } from 'express';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import { render } from 'svelte/server';
import { ConfigurationServeur } from './configurationServeur';
import { guidePresentation } from './guides/guidePresentation';
import { corpsVide, valideCorpsRequete } from './zod';

export const ressourceTestSsr = ({
  fournisseurChemin,
  adaptateurEnvironnement,
  entrepotGuide,
}: ConfigurationServeur) => {
  const router = Router();
  router.get('/', valideCorpsRequete(corpsVide), async (_req, reponse: Response) => {
    const pageJekyll = fournisseurChemin.cheminPageJekyll('catalogue');
    const fichier = fs.readFileSync(pageJekyll, 'utf-8');

    const composants = [...fichier.matchAll(/<div id="(.*)"><\/div>/g)].map((e) => e[1]);

    let résultat = fichier;
    let tousLesHead = '';

    const nonceAleatoire = randomBytes(16).toString('base64');
    reponse.locals.nonce = nonceAleatoire;
    résultat = résultat.replaceAll('%%NONCE%%', nonceAleatoire);
    résultat = résultat.replaceAll('%%VERSION%%', adaptateurEnvironnement.versionDeConstruction());

    const guides = await entrepotGuide.tous();
    const guidesPublies = guides.filter((guide) => guide.estPublie()).map(guidePresentation(adaptateurEnvironnement));

    for (const nomComposant of composants) {
      try {
        const composant = await import('../../../front/lib-svelte/dist/serveur/assets/' + nomComposant + '.js');

        let props = {};
        if (nomComposant === 'catalogue') {
          props = {
            itemsCyber: [
              {
                id: 'toto',
                type: 'ItemCyber',
                typologie: 'outil',
                description: 'COUCOU',
                droitsAcces: ['ACCES_LIBRE'],
                lienExterne: '',
                illustration: '',
              },
            ],
            repartition: { TOUS: ['toto'] },
            guides: guidesPublies,
          };
        }

        const { body, head } = render(composant.default, { props });
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
