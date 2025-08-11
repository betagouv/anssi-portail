import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  ClientHttp,
  EntrepotFinancementGrist,
  RetourApiGrist,
} from '../../src/infra/entrepotFinancementGrist';
import { Financement } from '../../src/metier/financement';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets';

describe("L'entrepot de financement Grist", () => {
  const clientHttp: ClientHttp = {
    get: async () => {},
  };
  const entrepotFinancementGrist = new EntrepotFinancementGrist({
    clientHttp,
    adaptateurEnvironnement: fauxAdaptateurEnvironnement,
  });

  it('sait récupérer des financements en appelant Grist', async () => {
    let urlAppelee = '';
    let headerAuthent;

    clientHttp.get = async (url, config) => {
      urlAppelee = url;
      headerAuthent = config?.headers?.Authorization;
      return {
        data: { records: [] } satisfies RetourApiGrist,
      };
    };

    await entrepotFinancementGrist.tous();

    assert.equal(headerAuthent, 'Bearer FAUSSE_CLE_API');
    assert.equal(
      urlAppelee,
      'http://grist/api/docs/idDeMonDocument/tables/idDeMaTable/records'
    );
  });

  it("sait transfomer le retour de l'API Grist en financements", async () => {
    clientHttp.get = async () => {
      return {
        data: {
          records: [
            {
              id: 10,
              fields: {
                Nom_du_dispositif: 'Cyber PME',
                Financement: [
                  'L',
                  'Prestations de conseil',
                  "Appui à l'investissement",
                ],
                Financeur: 'BPI France',
                Entites_eligibles: ['L', 'PME', 'ETI'],
                Perimetre_geographique: ['L', 'France'],
                Objectifs: 'Lune',
                Operations_eligibles: 'La division euclidienne',
                Beneficiaire: 'Tout le monde',
                Montant: 'Mille milliards',
                Region: 'France',
                Contact: 'president.du.monde@mail.org',
                Source: 'https://www.aides-entreprises.fr/aide/11454',
              },
            },
            {
              id: 21,
              fields: {
                Nom_du_dispositif: 'Pass Cyber formation',
                Financement: ['L', 'Formation'],
                Financeur: 'CCI des Hauts-de-France',
                Entites_eligibles: ['L', 'TPE', 'PME'],
                Perimetre_geographique: ['L', 'Hauts-de-France'],
                Objectifs: null,
                Operations_eligibles: null,
                Beneficiaire: null,
                Montant: null,
                Region: 'Hauts-de-France',
                Contact: null,
                Source: 'https://www.aides-entreprises.fr/aide/10124',
              },
            },
          ],
        } satisfies RetourApiGrist,
      };
    };

    const financements = await entrepotFinancementGrist.tous();

    assert.deepEqual(financements, [
      {
        id: 10,
        nom: 'Cyber PME',
        benificiaires: 'Tout le monde',
        financeur: 'BPI France',
        entitesElligibles: ['PME', 'ETI'],
        perimetreGeographique: ['France'],
        regions: ['FRANCE'],
        objectifs: 'Lune',
        operationsElligibles: 'La division euclidienne',
        montant: 'Mille milliards',
        sources: ['https://www.aides-entreprises.fr/aide/11454'],
        contact: 'president.du.monde@mail.org',
      },
      {
        id: 21,
        nom: 'Pass Cyber formation',
        financeur: 'CCI des Hauts-de-France',
        entitesElligibles: ['TPE', 'PME'],
        perimetreGeographique: ['Hauts-de-France'],
        regions: ['FR-HDF'],
        objectifs: '',
        operationsElligibles: '',
        benificiaires: '',
        montant: '',
        sources: ['https://www.aides-entreprises.fr/aide/10124'],
        contact: '',
      },
    ] satisfies Financement[]);
  });
});
