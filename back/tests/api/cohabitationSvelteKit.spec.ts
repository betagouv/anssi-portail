import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { fabriqueMiddleware } from '../../src/api/middlewares/middleware.js';
import { creeServeur } from '../../src/api/msc/index.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnrichissement } from './fauxObjets.js';

const configuration = configurationDeTestDuServeur;
const middleware = fabriqueMiddleware({ ...configuration, adaptateurEnrichissement: fauxAdaptateurEnrichissement });

describe('La cohabitation de SvelteKit avec Express', () => {
  it('sert les mentions légales avec leur contenu et leur URL canonique', async () => {
    const serveur = creeServeur({ ...configuration, middleware });
    const réponse = await request(serveur).get('/mentions-legales').expect('Content-Type', /html/u).expect(200);

    expect(réponse.text).toContain('<h2>Éditeur</h2>');
    expect(réponse.text).toMatch(/<link rel="canonical" href="[^"]*\/mentions-legales"/u);
  });

  it('sert le contenu et les métadonnées de la fiche Conseil Technique', async () => {
    const serveur = creeServeur({ ...configuration, middleware });
    const réponse = await request(serveur).get('/services/conseil-technique').expect(200);
    expect(réponse.text).toContain('<title>Conseil Technique</title>');
    expect(réponse.text).toContain('GovernmentService');
    expect(réponse.text).toContain('<code>conseil.technique [at] ssi.gouv.fr</code>');
    expect(réponse.text).toContain('Le service conseil technique est accessible à tous.');
    await request(serveur).get('/services/conseil-technique.html').expect('Location', '/services/conseil-technique');
  });

  it('compresse le HTML Kit et partage le quota des API entre Kit et Express', async () => {
    const serveur = creeServeur({
      ...configuration,
      middleware,
      reseau: { ...configuration.reseau, trustProxy: 1, maxRequetesParMinuteAPI: 1 },
    });
    await request(serveur).get('/mentions-legales').set('Accept-Encoding', 'gzip').expect('Content-Encoding', 'gzip');
    await request(serveur).get('/api/pages-crisp/kit-relais').set('Forwarded', 'for=192.0.2.1').expect(200);
    await request(serveur).get('/api/infos-site').set('Forwarded', 'for=192.0.2.1').expect(429);
    await request(serveur).get('/api/infos-site').set('Forwarded', 'for=192.0.2.2').expect(200);
  });
});
