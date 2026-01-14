import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement';
import {
  AdapateurAidesEntreprisesAPI,
  AdaptateurSourceExterne,
  RetourAidesEntreprisesAPI,
} from '../../src/infra/adaptateurSourceExterne';
import { ClientHttp } from '../../src/infra/clientHttp';
import { fauxAdaptateurEnvironnement } from './fauxAdaptateurEnvironnement';
import { Financement } from '../../src/metier/financement';

describe("L'adaptateur Aides Entreprises API", () => {
  let adaptateurEnvironnement: AdaptateurEnvironnement;
  let clientHttp: ClientHttp<RetourAidesEntreprisesAPI>;
  let adapateurAidesEntreprisesAPI: AdaptateurSourceExterne;

  const retourAPI: RetourAidesEntreprisesAPI = [
    {
      id_aid: '10234',
      aid_benef: 'Tout le monde',
      aid_conditions: 'Avoir 10 doigts',
      aid_montant: 'Mille milliards',
      aid_nom: 'Cyber PME',
      aid_objet: 'Lune',
      aid_operations_el: 'La division euclidienne',
      financeurs: [{ org_nom: 'BPI France' }],
    },
  ];

  beforeEach(() => {
    adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      aidesEntreprises: () => ({
        url: () => 'http://example.com/financements',
        apiId: () => 'mon-api-id',
        apiKey: () => 'mon-api-key',
      }),
    };
    clientHttp = {
      get: async () => ({ data: [] }),
    };

    adapateurAidesEntreprisesAPI = new AdapateurAidesEntreprisesAPI({
      clientHttp,
      adaptateurEnvironnement,
    });
  });

  it("sait récupérer des aides en appelant l'API Aides Entreprises", async () => {
    let urlAppelee = '';
    let apiId = '';
    let apiKey = '';

    clientHttp.get = async (url, config) => {
      urlAppelee = url;
      apiId = config?.headers?.['X-Aidesentreprises-Id'] ?? '';
      apiKey = config?.headers?.['X-Aidesentreprises-Key'] ?? '';
      return {
        data: retourAPI,
      };
    };
    await adapateurAidesEntreprisesAPI.parId(10234);

    assert.equal(urlAppelee, 'http://example.com/financements/10234');
    assert.equal(apiId, 'mon-api-id');
    assert.equal(apiKey, 'mon-api-key');
  });

  it("ne renvoie rien si l'url source n'est pas définie", async () => {
    adaptateurEnvironnement.aidesEntreprises = () => ({
      url: () => '',
      apiId: () => '',
      apiKey: () => '',
    });

    const aide = await adapateurAidesEntreprisesAPI.parId(10234);

    assert.deepEqual(aide, undefined);
  });

  it("sait transfomer le retour de l'API en financements", async () => {
    clientHttp.get = async (_url, _config) => {
      return {
        data: retourAPI,
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
    } satisfies Financement);
  });

  it("renvoie undefined si l'API ne retourne pas d'aide", async () => {
    clientHttp.get = async (_url, _config) => {
      return {
        data: false,
      };
    };

    const aide = await adapateurAidesEntreprisesAPI.parId(10234);

    assert.deepEqual(aide, undefined);
  });
});
