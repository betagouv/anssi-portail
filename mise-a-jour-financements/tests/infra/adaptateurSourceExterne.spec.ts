import { beforeEach, describe, expect, it, vi } from 'vitest';
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
      const get = vi.spyOn(clientHttp, 'get').mockResolvedValue({ data: aidesDeLAPI });

      await adapateurAidesEntreprisesAPI.parId(10234);

      expect(get).toHaveBeenCalledExactlyOnceWith('http://example.com/financements/10234', {
        headers: {
          'X-Aidesentreprises-Id': 'mon-api-id',
          'X-Aidesentreprises-Key': 'mon-api-key',
        },
      });
    });

    it("et ne rien renvoyer si l'url source n'est pas définie", async () => {
      adaptateurEnvironnement.aidesEntreprises = () => ({
        url: () => '',
        urlAPI: () => '',
        apiId: () => '',
        apiKey: () => '',
      });

      const aide = await adapateurAidesEntreprisesAPI.parId(10234);

      expect(aide).toBeUndefined();
    });

    it("et ne rien renvoyer si l'aide n'est pas active", async () => {
      vi.spyOn(clientHttp, 'get').mockResolvedValue({
        data: [{ ...aidesDeLAPI, status: '0' }],
      });
      const aide = await adapateurAidesEntreprisesAPI.parId(10234);

      expect(aide).toBeUndefined();
    });

    it("et transfomer le retour de l'API en financements", async () => {
      vi.spyOn(clientHttp, 'get').mockResolvedValue({
        data: aidesDeLAPI,
      });

      const aide = await adapateurAidesEntreprisesAPI.parId(10234);

      expect(aide).toEqual({
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
      vi.spyOn(clientHttp, 'get').mockResolvedValue({
        data: false,
      });

      const aide = await adapateurAidesEntreprisesAPI.parId(10234);

      expect(aide).toBeUndefined();
    });

    describe('et gérer les financeurs', () => {
      it("quand il n'y en a pas", async () => {
        vi.spyOn(clientHttp, 'get').mockResolvedValue({
          data: [
            {
              ...aidesDeLAPI[0],
              financeurs: [],
            },
          ],
        });

        const aide = await adapateurAidesEntreprisesAPI.parId(10234);

        expect(aide).toEqual({
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
        vi.spyOn(clientHttp, 'get').mockResolvedValue({
          data: [
            {
              ...aidesDeLAPI[0],
              financeurs: [{ org_nom: 'Financeur 1' }, { org_nom: 'Financeur 2' }],
            },
          ],
        });

        const aide = await adapateurAidesEntreprisesAPI.parId(10234);

        expect(aide).toEqual({
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
      const get = vi.spyOn(clientHttp, 'get').mockResolvedValue({ data: { data: [] } });
      await adapateurAidesEntreprisesAPI.chercheAidesCyber();

      expect(get).toHaveBeenCalledExactlyOnceWith(
        'http://example.com/financements?full_text=cyber&status=1&limit=50&offset=0',
        {
          headers: {
            'X-Aidesentreprises-Id': 'mon-api-id',
            'X-Aidesentreprises-Key': 'mon-api-key',
          },
        }
      );
    });

    it("et ne rien renvoyer si l'url source n'est pas définie", async () => {
      adaptateurEnvironnement.aidesEntreprises = () => ({
        url: () => '',
        urlAPI: () => '',
        apiId: () => '',
        apiKey: () => '',
      });

      const nouvellesAides = await adapateurAidesEntreprisesAPI.chercheAidesCyber();

      expect(nouvellesAides).toEqual([]);
    });

    it("et transfomer le retour de l'API en financements", async () => {
      vi.spyOn(clientHttp, 'get').mockResolvedValue({
        data: { data: [resumesAides] },
      });

      const nouvellesAides = await adapateurAidesEntreprisesAPI.chercheAidesCyber();

      expect(nouvellesAides).toEqual([
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
      const get = vi
        .spyOn(clientHttp, 'get')
        .mockResolvedValueOnce({ data: { data: resultats50 } })
        .mockResolvedValueOnce({ data: { data: [resumesAides] } })
        .mockRejectedValue(new Error('Appel de pagination supplémentaire inattendu'));
      await adapateurAidesEntreprisesAPI.chercheAidesCyber();

      expect(get).toHaveBeenCalledTimes(2);
      expect(get).toHaveBeenNthCalledWith(
        1,
        'http://example.com/financements?full_text=cyber&status=1&limit=50&offset=0',
        expect.any(Object)
      );
      expect(get).toHaveBeenNthCalledWith(
        2,
        'http://example.com/financements?full_text=cyber&status=1&limit=50&offset=50',
        expect.any(Object)
      );
    });
  });
});
