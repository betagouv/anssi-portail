import assert from 'node:assert';
import { describe, it } from 'node:test';
import { fabriqueAdaptateurMatamo } from '../../src/infra/adaptateurAnalytique';
import { ClientHttpPosteur } from '../../src/infra/clientHttp';
import { DonneesEvenement } from '../../src/infra/donneesEvenement';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets';

describe("L'adaptateur Matomo", () => {
  describe("Lors du rapport d'un événement de téléchargement de guide", () => {
    const evenement: DonneesEvenement = {
      type: 'DOCUMENT_GUIDE_TELECHARGE',
      donnees: {
        nomFichier: 'zero-trust.pdf',
        origine: 'msc',
      },
      date: new Date('2026-01-01T10:11:12.000'),
    };
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
        'https://stats.beta.gouv.fr/matomo.php?rec=1&idsite=227&e_c=Guides&e_a=Document+t%C3%A9l%C3%A9charg%C3%A9+depuis+msc&e_n=zero-trust.pdf'
      );
    });

    it('précise que la source est inconnue', () => {
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

      adaptateurMatomo.rapporteEvenement({
        ...evenement,
        donnees: { ...evenement.donnees, origine: undefined },
      });

      assert.equal(
        urlAppelee,
        'https://stats.beta.gouv.fr/matomo.php?rec=1&idsite=227&e_c=Guides&e_a=Document+t%C3%A9l%C3%A9charg%C3%A9+depuis+source+inconnue&e_n=zero-trust.pdf'
      );
    });
  });

  describe("Lors du rapport d'un événement de téléchargement de visa", () => {
    const evenement: DonneesEvenement = {
      type: 'VISA_TELECHARGE',
      donnees: {
        nomFichier: 'zero-trust.pdf',
      },
      date: new Date('2026-01-01T10:11:12.000'),
    };
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
        'https://stats.beta.gouv.fr/matomo.php?rec=1&idsite=227&e_c=Visas&e_a=Visa+t%C3%A9l%C3%A9charg%C3%A9&e_n=zero-trust.pdf'
      );
    });
  });
});
