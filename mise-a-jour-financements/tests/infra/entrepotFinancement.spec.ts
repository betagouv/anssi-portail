import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ClientHttp } from '../../src/infra/clientHttp';
import {
  EntrepotFinancementGrist,
  RetourApiGrist,
} from '../../src/infra/entrepotFinancement';
import { Financement } from '../../src/metier/financement';
import { fauxAdaptateurEnvironnement } from './fauxAdaptateurEnvironnement';

describe("L'entrepot de financement Grist", () => {
  const clientHttp: ClientHttp<RetourApiGrist> = {
    get: async () => ({ data: { records: [] } }),
  };
  const entrepotFinancementGrist = new EntrepotFinancementGrist({
    clientHttp,
    adaptateurEnvironnement: fauxAdaptateurEnvironnement,
  });

  it("ne renvoie rien si l'url source n'est pas définie", async () => {
    const entrepotFinancementGristHorsLigne = new EntrepotFinancementGrist({
      clientHttp,
      adaptateurEnvironnement: {
        ...fauxAdaptateurEnvironnement,
        grist: () => ({
          cleApiFinancements: () => '',
          cleApiGuides: () => '',
          urlFinancements: () => '',
          urlGuides: () => '',
          dureeCacheEnSecondes: () => 0,
        }),
      },
    });

    const financements = await entrepotFinancementGristHorsLigne.tous();

    assert.deepEqual(financements, []);
  });

  it('sait récupérer des financements en appelant Grist', async () => {
    let urlAppelee = '';
    let headerAuthent;

    clientHttp.get = async (url, config) => {
      urlAppelee = url;
      headerAuthent = config?.headers?.Authorization;
      return {
        data: { records: [] },
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
                ID_Aides_entreprises: 10234,
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
                Conditions: 'Avoir 10 doigts',
                Region: 'France',
                Contact: 'president.du.monde@mail.org',
                Source: 'https://www.aides-entreprises.fr/aide/11454',
              },
            },
            {
              id: 21,
              fields: {
                ID_Aides_entreprises: 10235,
                Nom_du_dispositif: 'Pass Cyber formation',
                Financement: ['L', 'Formation'],
                Financeur: 'CCI des Hauts-de-France',
                Entites_eligibles: ['L', 'TPE', 'PME'],
                Perimetre_geographique: ['L', 'Hauts-de-France'],
                Objectifs: null,
                Operations_eligibles: null,
                Beneficiaire: null,
                Montant: null,
                Conditions: null,
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
        id: 10234,
        nom: 'Cyber PME',
        benificiaires: 'Tout le monde',
        financeur: 'BPI France',
        objectifs: 'Lune',
        operationsEligibles: 'La division euclidienne',
        montant: 'Mille milliards',
        condition: 'Avoir 10 doigts',
      },
      {
        id: 10235,
        nom: 'Pass Cyber formation',
        financeur: 'CCI des Hauts-de-France',
        objectifs: '',
        operationsEligibles: '',
        benificiaires: '',
        condition: '',
        montant: '',
      },
    ] satisfies Financement[]);
  });
});
