import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ClientHttp } from '../../src/infra/clientHttp';
import { ReponseGrist } from '../../src/infra/entrepotGrist';
import { FournisseurHorloge } from '../../src/infra/fournisseurHorloge';
import { EntrepotGristGenerique } from './EntrepotGristGenerique';
import { FournisseurHorlogeDeTest } from './fournisseurHorlogeDeTest';

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
      clientHttp,
      'urlDeBase',
      'cleApi',
      60
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
      clientHttp,
      'urlDeBase',
      'cleApi',
      60
    );

    const premier = await entrepotRessourcesCyberGrist.avecFiltre(1);
    const second = await entrepotRessourcesCyberGrist.avecFiltre(2);

    assert.notDeepStrictEqual(premier, second);
  });

  const add = (date: Date, duration: { hours: number }) => {
    return new Date(date.getTime() + duration.hours * 3600000);
  };

  const ilSePasse2Heures = (): void => {
    FournisseurHorlogeDeTest.initialise(
      add(FournisseurHorloge.maintenant(), { hours: 2 })
    );
  };

  it("retourne la valeur précédente en cas d'erreur Grist", async () => {
    let i = 0;
    const clientHttp: ClientHttp<ReponseGrist<{ test: string }>> = {
      get: async (_url: string) => {
        if (i === 0) {
          i++;
          return { data: { records: [{ test: 'une chaine'  }] } };
        }
        return Promise.reject(new Error('Erreur 404'));
      },
    };
    const entrepotRessourcesCyberGrist = new EntrepotGristGenerique(
      clientHttp,
      'urlDeBase',
      'cleApi',
      60
    );
    await entrepotRessourcesCyberGrist.tous();
    ilSePasse2Heures()

    const resultat = await entrepotRessourcesCyberGrist.tous();

    assert.deepStrictEqual(resultat, [{ test: 'une chaine' }]);
  });
});
