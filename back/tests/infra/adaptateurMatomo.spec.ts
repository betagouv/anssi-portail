import { describe, it } from 'node:test';
import { fabriqueAdaptateurMatamo } from '../../src/infra/adaptateurAnalytique';
import { ClientHttpPosteur } from '../../src/infra/clientHttp';
import { DonneesEvenement } from '../../src/infra/donneesEvenement';
import assert from 'node:assert';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets';

describe("L'adpatateur Matomo", () => {
  const evenement: DonneesEvenement = {
    type: 'GUIDE_TELECHARGE',
    donnees: {
      id: 'zero-trust.pdf',
    },
    date: new Date('2026-01-01T10:11:12.000'),
  };
  describe("Lors du rapport d'un événement", () => {
    it('envoie une requete POST à la bonne URL', () => {
      let urlAppelee: string = '';
      const posteur: ClientHttpPosteur<DonneesEvenement, undefined> = {
        post: async (url, _corps) => {
          urlAppelee = url;
          return { data: undefined };
        },
      };
      const adaptateurMatomo = fabriqueAdaptateurMatamo(
        posteur,
        fauxAdaptateurEnvironnement
      );

      adaptateurMatomo.rapporteEvenement(evenement);

      assert.equal(
        urlAppelee,
        'https://stats.beta.gouv.fr/matomo.php?rec=1&action_name=Guide+T%C3%A9l%C3%A9charg%C3%A9&idsite=227&c_t=zero-trust.pdf'
      );
    });
  });
});
