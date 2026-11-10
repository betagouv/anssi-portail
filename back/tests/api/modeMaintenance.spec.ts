import request from 'supertest';
import { describe, expect, it } from 'vitest';
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
  it('sers les ressources statiques', async () => {
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

    const réponse = await request(serveur).get('/assets');

    expect(réponse.status).toBe(200);
  });
});
