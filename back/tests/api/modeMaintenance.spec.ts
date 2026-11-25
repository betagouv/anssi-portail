import request from 'supertest';
import { describe, it } from 'vitest';
import { fabriqueMiddleware } from '../../src/api/middlewares/middleware.js';
import { creeServeur } from '../../src/api/msc/index.js';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurEnrichissement,
  fauxAdaptateurEnvironnement,
  fauxAdaptateurJWT,
  fauxFournisseurDeChemin,
} from './fauxObjets.js';

describe('Lorsque l’application est en maintenance', () => {
  it('sert les ressources statiques et renvoie la page de maintenance sur les routes migrées', async () => {
    const middleware = fabriqueMiddleware({
      adaptateurJWT: fauxAdaptateurJWT,
      fournisseurChemin: fauxFournisseurDeChemin,
      adaptateurEnvironnement: {
        ...fauxAdaptateurEnvironnement,
        maintenance: { actif: () => true, detailsPreparation: () => undefined },
      },
      adaptateurEnrichissement: fauxAdaptateurEnrichissement,
    });
    const configurationServeur = {
      ...configurationDeTestDuServeur,
      middleware,
    };
    const serveur = creeServeur(configurationServeur);

    await request(serveur).get('/assets').expect(200);
    await request(serveur).get('/_app/version.json').expect('Content-Type', /json/u).expect(200);
    await request(serveur).get('/mentions-legales').expect('Content-Type', /html/u).expect(503);
  });
});
