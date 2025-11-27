import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ClientHttp } from '../../src/infra/clientHttp';
import { ReponseGrist } from '../../src/infra/entrepotGrist';
import { EntrepotGristGenerique } from './EntrepotGristGenerique';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets';

describe("L'entrepôt Grist générique", () => {
  it('mets en cache le résultat de l’appel à Grist', async () => {
    let nombreAppel = 0;
    const clientHttp: ClientHttp<ReponseGrist<{ test: string }>> = {
      get: async (_url: string) => {
        nombreAppel++;
        return { data: { records: [{ test: 'une chaine' }] } };
      },
    };
    const entrepotRessourcesCyberGrist = new EntrepotGristGenerique(
      fauxAdaptateurEnvironnement,
      clientHttp
    );

    await entrepotRessourcesCyberGrist.tous();
    const resultat = await entrepotRessourcesCyberGrist.tous();

    assert.equal(nombreAppel, 1);
    assert.deepStrictEqual(resultat, [{ test: 'une chaine' }]);
  });

  it("mets en cache les résultats d'appels à Grist avec des filtres différents", async () => {
    const clientHttp: ClientHttp<ReponseGrist<{ test: string }>> = {
      get: async (url: string) => {
        return { data: { records: [{ test: 'une chaine de ' + url }] } };
      },
    };
    const entrepotRessourcesCyberGrist = new EntrepotGristGenerique(
      fauxAdaptateurEnvironnement,
      clientHttp
    );

    const premier = await entrepotRessourcesCyberGrist.avecFiltre(1);
    const second = await entrepotRessourcesCyberGrist.avecFiltre(2);

    assert.notDeepStrictEqual(premier, second);
  });
});
