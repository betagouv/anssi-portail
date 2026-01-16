import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement';
import {
  AdapateurAidesEntreprisesAPI,
  AdaptateurSourceExterne,
  Aide,
  ResumeAide,
} from '../../src/infra/adaptateurSourceExterne';
import { ClientHttp } from '../../src/infra/clientHttp';
import { Financement } from '../../src/metier/financement';
import { fauxAdaptateurEnvironnement } from './fauxAdaptateurEnvironnement';

describe("L'adaptateur Aides Entreprises API", () => {
  let adaptateurEnvironnement: AdaptateurEnvironnement;
  let clientHttp: ClientHttp;
  let adapateurAidesEntreprisesAPI: AdaptateurSourceExterne;

  const aidesDeLAPI: Aide[] = [
    {
      status: '1',
      id_aid: '10234',
      aid_benef: 'Tout le monde',
      aid_conditions: 'Avoir 10 doigts',
      aid_montant: 'Mille milliards',
      aid_nom: 'Cyber PME',
      aid_objet: 'Lune',
      aid_operations_el: 'La division euclidienne',
      financeurs: [{ org_nom: 'BPI France' }],
      horodatage: '2025-12-31 10:00:01',
    },
  ];

  beforeEach(() => {
    adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      aidesEntreprises: () => ({
        ...fauxAdaptateurEnvironnement.aidesEntreprises(),
      }),
    };
    clientHttp = {
      get: async <T>() => ({ data: [] as unknown as T }),
    };

    adapateurAidesEntreprisesAPI = new AdapateurAidesEntreprisesAPI({
      clientHttp,
      adaptateurEnvironnement,
    });
  });

  describe('sait récupérer une aide', () => {
    it("en appelant l'API Aides Entreprises", async () => {
      let urlAppelee = '';
      let apiId = '';
      let apiKey = '';

      clientHttp.get = async <T>(
        url: string,
        config?: { headers?: Record<string, string> }
      ) => {
        urlAppelee = url;
        apiId = config?.headers?.['X-Aidesentreprises-Id'] ?? '';
        apiKey = config?.headers?.['X-Aidesentreprises-Key'] ?? '';
        return {
          data: aidesDeLAPI as unknown as T,
        };
      };

      await adapateurAidesEntreprisesAPI.parId(10234);

      assert.equal(urlAppelee, 'http://example.com/financements/10234');
      assert.equal(apiId, 'mon-api-id');
      assert.equal(apiKey, 'mon-api-key');
    });

    it("et ne rien renvoyer si l'url source n'est pas définie", async () => {
      adaptateurEnvironnement.aidesEntreprises = () => ({
        url: () => '',
        urlAPI: () => '',
        apiId: () => '',
        apiKey: () => '',
      });

      const aide = await adapateurAidesEntreprisesAPI.parId(10234);

      assert.deepEqual(aide, undefined);
    });

    it("et ne rien renvoyer si l'aide n'est pas active", async () => {
      clientHttp.get = async <T>() => {
        return {
          data: [{ ...aidesDeLAPI, status: '0' }] as unknown as T,
        };
      };
      const aide = await adapateurAidesEntreprisesAPI.parId(10234);

      assert.deepEqual(aide, undefined);
    });

    it("et transfomer le retour de l'API en financements", async () => {
      clientHttp.get = async <T>() => {
        return {
          data: aidesDeLAPI as unknown as T,
        };
      };

      const aide = await adapateurAidesEntreprisesAPI.parId(10234);

      assert.deepEqual(aide, {
        id: 10234,
        nom: 'Cyber PME',
        benificiaires: 'Tout le monde',
        financeur: 'BPI France',
        objectifs: 'Lune',
        operationsEligibles: 'La division euclidienne',
        montant: 'Mille milliards',
        condition: 'Avoir 10 doigts',
        derniereModification: new Date('2025-12-31 10:00:01'),
      } satisfies Financement);
    });

    it("et renvoyer une résultat non défini si l'API ne retourne pas d'aide", async () => {
      clientHttp.get = async <T>() => {
        return {
          data: false as unknown as T,
        };
      };

      const aide = await adapateurAidesEntreprisesAPI.parId(10234);

      assert.deepEqual(aide, undefined);
    });

    describe('et gérer les financeurs', () => {
      it("quand il n'y en a pas", async () => {
        clientHttp.get = async <T>() => {
          return {
            data: [
              {
                ...aidesDeLAPI[0],
                financeurs: [],
              },
            ] as unknown as T,
          };
        };

        const aide = await adapateurAidesEntreprisesAPI.parId(10234);

        assert.deepEqual(aide, {
          id: 10234,
          nom: 'Cyber PME',
          benificiaires: 'Tout le monde',
          financeur: '',
          objectifs: 'Lune',
          operationsEligibles: 'La division euclidienne',
          montant: 'Mille milliards',
          condition: 'Avoir 10 doigts',
          derniereModification: new Date('2025-12-31 10:00:01'),
        } satisfies Financement);
      });

      it('quand il y en a plusieurs', async () => {
        clientHttp.get = async <T>() => {
          return {
            data: [
              {
                ...aidesDeLAPI[0],
                financeurs: [
                  { org_nom: 'Financeur 1' },
                  { org_nom: 'Financeur 2' },
                ],
              },
            ] as unknown as T,
          };
        };

        const aide = await adapateurAidesEntreprisesAPI.parId(10234);

        assert.deepEqual(aide, {
          id: 10234,
          nom: 'Cyber PME',
          benificiaires: 'Tout le monde',
          financeur: 'Financeur 1, Financeur 2',
          objectifs: 'Lune',
          operationsEligibles: 'La division euclidienne',
          montant: 'Mille milliards',
          condition: 'Avoir 10 doigts',
          derniereModification: new Date('2025-12-31 10:00:01'),
        } satisfies Financement);
      });
    });
  });

  describe('sait rechercher de nouvelles aides cyber', () => {
    const resumesAides: ResumeAide = {
      status: '1',
      id_aid: '10234',
      aid_benef: 'Tout le monde',
      aid_conditions: 'Avoir 10 doigts',
      aid_montant: 'Mille milliards',
      aid_nom: 'Cyber PME',
      aid_objet: 'Lune',
      aid_operations_el: 'La division euclidienne',
      horodatage: '2025-12-31 10:00:01',
    };
    it("en appelant l'API Aides Entreprises", async () => {
      let urlAppelee = '';
      let apiId = '';
      let apiKey = '';

      clientHttp.get = async <T>(
        url: string,
        config?: { headers?: Record<string, string> }
      ) => {
        urlAppelee = url;
        apiId = config?.headers?.['X-Aidesentreprises-Id'] ?? '';
        apiKey = config?.headers?.['X-Aidesentreprises-Key'] ?? '';
        return {
          data: { data: [] } as unknown as T,
        };
      };
      await adapateurAidesEntreprisesAPI.chercheAidesCyber();

      assert.equal(
        urlAppelee,
        'http://example.com/financements?full_text=cyber&status=1&limit=50&offset=0'
      );
      assert.equal(apiId, 'mon-api-id');
      assert.equal(apiKey, 'mon-api-key');
    });

    it("et ne rien renvoyer si l'url source n'est pas définie", async () => {
      adaptateurEnvironnement.aidesEntreprises = () => ({
        url: () => '',
        urlAPI: () => '',
        apiId: () => '',
        apiKey: () => '',
      });

      const nouvellesAides =
        await adapateurAidesEntreprisesAPI.chercheAidesCyber();

      assert.deepEqual(nouvellesAides, []);
    });

    it("et transfomer le retour de l'API en financements", async () => {
      clientHttp.get = async <T>() => {
        return {
          data: { data: [resumesAides] } as unknown as T,
        };
      };

      const nouvellesAides =
        await adapateurAidesEntreprisesAPI.chercheAidesCyber();

      assert.deepEqual(nouvellesAides, [
        {
          id: 10234,
          nom: 'Cyber PME',
          benificiaires: 'Tout le monde',
          financeur: '',
          objectifs: 'Lune',
          operationsEligibles: 'La division euclidienne',
          montant: 'Mille milliards',
          condition: 'Avoir 10 doigts',
          derniereModification: new Date('2025-12-31 10:00:01'),
        },
      ] satisfies Financement[]);
    });

    it('en gérant une nombre élevé de resultats via la pagination', async () => {
      const resultats50 = new Array(50).fill(resumesAides);
      const urlsAppelees: string[] = [];

      clientHttp.get = async <T>(url: string) => {
        urlsAppelees.push(url);
        if (url.includes('offset=0')) {
          return {
            data: { data: resultats50 } as unknown as T,
          };
        }
        if (url.includes('offset=50')) {
          return {
            data: { data: [resumesAides] } as unknown as T,
          };
        }
        throw new Error('échec du test !! erreur non prévue');
      };
      await adapateurAidesEntreprisesAPI.chercheAidesCyber();

      assert.deepEqual(urlsAppelees, [
        'http://example.com/financements?full_text=cyber&status=1&limit=50&offset=0',
        'http://example.com/financements?full_text=cyber&status=1&limit=50&offset=50',
      ]);
    });
  });
});
