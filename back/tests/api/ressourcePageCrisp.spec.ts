import { creeEntrepotKitRelais } from '@anssi-portail/msc/kit-relais';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { creeServeur } from '../../src/api/msc/index.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';

const url = '/api/pages-crisp/kit-relais';
const kit = {
  titre: 'Le kit relais',
  description: 'Les supports de communication',
  contenu: '<p>Supports de communication</p>',
  tableDesMatières: [],
};

describe('Le kit relais', () => {
  it('rend le contenu et les métadonnées avec une seule lecture et sans script fourni par le CMS', async () => {
    const recupereArticle = vi.fn().mockResolvedValue({
      titre: kit.titre,
      description: kit.description,
      contenu: kit.contenu + '<script>indesirable()</script>',
      tableDesMatieres: [],
    });
    const entrepotKitRelais = creeEntrepotKitRelais({ recupereArticle }, Temporal.Duration.from({ minutes: 5 }));
    const serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotKitRelais });
    const réponse = await request(serveur).get('/kit-relais').expect(200);
    expect(réponse.text).toContain('<title>Le kit relais | MesServicesCyber</title>');
    expect(réponse.text).toContain(kit.contenu);
    expect(réponse.text).toContain('<meta name="description" content="Les supports de communication"');
    expect(réponse.text).not.toContain('indesirable()');
    await request(serveur).get(url).expect(200, kit);
    expect(recupereArticle).toHaveBeenCalledExactlyOnceWith('le-kit-relais-messervicescyber');
  });

  it('conserve la réponse 404 de Crisp et le traitement historique des slugs inconnus', async () => {
    const recupereArticle = vi.fn().mockRejectedValue({ isAxiosError: true, response: { status: 404 } });
    const entrepotKitRelais = creeEntrepotKitRelais({ recupereArticle }, Temporal.Duration.from({ minutes: 5 }));
    const serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotKitRelais });
    await request(serveur).get(url).expect(404, 'Not Found');
    await request(serveur).get('/api/pages-crisp/inconnu').expect(404);
    expect(recupereArticle).toHaveBeenCalledTimes(1);
  });

  it('signale une seule fois une erreur du CMS pendant le rendu', async () => {
    const erreur = new Error('CMS indisponible');
    const rapporteur = { erreur: vi.fn() };
    const serveur = creeServeur({
      ...configurationDeTestDuServeur,
      rapporteur,
      entrepotKitRelais: { lis: vi.fn().mockRejectedValue(erreur) },
    });
    await request(serveur).get('/kit-relais').expect(500);
    expect(rapporteur.erreur).toHaveBeenCalledExactlyOnceWith(erreur, 'SvelteKit');
  });
});
