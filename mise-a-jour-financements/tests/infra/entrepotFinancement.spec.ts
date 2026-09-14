import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement';
import { ClientHttp } from '../../src/infra/clientHttp';
import { EntrepotFinancement, EntrepotFinancementGrist, RetourApiGrist } from '../../src/infra/entrepotFinancement';
import { Financement } from '../../src/metier/financement';
import { fauxAdaptateurEnvironnement } from './fauxAdaptateurEnvironnement';

describe("L'entrepot de financement Grist", () => {
  let adaptateurEnvironnement: AdaptateurEnvironnement;
  let clientHttp: ClientHttp;
  let entrepotFinancementGrist: EntrepotFinancement;

  beforeEach(() => {
    adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      grist: () => ({
        urlFinancements: () => 'http://grist/api/docs/idDeMonDocument/tables/idDeMaTable/records',
        cleApiFinancements: () => 'FAUSSE_CLE_API',
      }),
    };
    clientHttp = {
      get: async <T>() => ({ data: { records: [] } as unknown as T }),
    };

    entrepotFinancementGrist = new EntrepotFinancementGrist({
      clientHttp,
      adaptateurEnvironnement,
    });
  });

  it("ne renvoie rien si l'url source n'est pas définie", async () => {
    adaptateurEnvironnement.grist = () => ({
      cleApiFinancements: () => '',
      urlFinancements: () => '',
    });

    const financements = await entrepotFinancementGrist.tous();

    expect(financements).toEqual([]);
  });

  it('sait récupérer des financements en appelant Grist', async () => {
    const get = vi.spyOn(clientHttp, 'get').mockResolvedValue({ data: { records: [] } });

    await entrepotFinancementGrist.tous();

    expect(get).toHaveBeenCalledExactlyOnceWith('http://grist/api/docs/idDeMonDocument/tables/idDeMaTable/records', {
      headers: { Authorization: 'Bearer FAUSSE_CLE_API' },
    });
  });

  it("sait transfomer le retour de l'API Grist en financements", async () => {
    const retourAPI: RetourApiGrist = {
      records: [
        {
          id: 10,
          fields: {
            ID_Aides_entreprises: 10234,
            Nom_du_dispositif: 'Cyber PME',
            Financement: ['L', 'Prestations de conseil', "Appui à l'investissement"],
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
            Date_derniere_modification: null,
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
            Date_derniere_modification: 1759269600,
          },
        },
      ],
    };
    vi.spyOn(clientHttp, 'get').mockResolvedValue({
      data: retourAPI,
    });

    const financements = await entrepotFinancementGrist.tous();

    expect(financements).toEqual([
      {
        id: 10234,
        nom: 'Cyber PME',
        benificiaires: 'Tout le monde',
        financeur: 'BPI France',
        objectifs: 'Lune',
        operationsEligibles: 'La division euclidienne',
        montant: 'Mille milliards',
        condition: 'Avoir 10 doigts',
        derniereModification: undefined,
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
        derniereModification: new Date(1759269600000),
      },
    ] satisfies Financement[]);
  });
});
