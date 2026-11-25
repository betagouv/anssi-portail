import axios from '@anssi-portail/axios';
import { describe, expect, it, vi } from 'vitest';
import { AdaptateurRechercheEntrepriseGouv } from '../../src/infra/adaptateurRechercheEntrepriseGouv.js';
import { fauxAdaptateurEnvironnement, fauxRapporteur } from '../api/fauxObjets.js';

describe('La recherche entreprise', () => {
  const resultatSirene = () => ({
    nom_complet: 'Organisation',
    siege: { departement: '92', siret: '18008001200248', region: '11' },
    matching_etablissements: [{ commune: '92026', siret: '18008001200248', liste_enseignes: [] }],
    complements: { est_association: false, collectivite_territoriale: null },
    activite_principale: '84.13Z',
    activite_principale_naf25: '84.13Y',
  });

  describe('avec cache', () => {
    it('retourne le résultat de la recherche entreprise', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({ data: { results: [resultatSirene()] } });
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      const resultats = await adaptateur.rechercheOrganisations('Organisation', '92');

      expect(resultats).toEqual([
        {
          nom: 'Organisation',
          departement: '92',
          siret: '18008001200248',
          codeRegion: 'FR-IDF',
          codeSecteur: undefined,
          codeTrancheEffectif: undefined,
          estAssociation: false,
          estCollectivite: false,
          codeActivite: '84.13Y',
        },
      ]);
    });

    it("retourne un code d'activité indéfini quand le code NAF 2025 est absent", async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({
        data: { results: [{ ...resultatSirene(), activite_principale_naf25: null }] },
      });
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      const resultats = await adaptateur.rechercheOrganisations('Organisation', '92');

      expect(resultats[0].codeActivite).toBeUndefined();
    });

    it('ne rappelle pas la recherche entreprise deux fois', async () => {
      const get = vi.spyOn(axios, 'get').mockResolvedValue({ data: { results: [resultatSirene()] } });
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      const premierResultat = await adaptateur.rechercheOrganisations('Organisation', '92');
      const secondResultat = await adaptateur.rechercheOrganisations('Organisation', '92');

      expect(secondResultat).toEqual(premierResultat);
      expect(get).toHaveBeenCalledTimes(1);
    });

    it('distingue les éléments à mettre en cache par terme et département', async () => {
      const get = vi.spyOn(axios, 'get').mockResolvedValue({ data: { results: [resultatSirene()] } });
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      await adaptateur.rechercheOrganisations('Organisation', '92');
      await adaptateur.rechercheOrganisations('Autre organisation', '92');
      await adaptateur.rechercheOrganisations('Organisation', null);
      await adaptateur.rechercheOrganisations('Organisation', '92');
      await adaptateur.rechercheOrganisations('Autre organisation', '92');
      await adaptateur.rechercheOrganisations('Organisation', null);

      expect(get).toHaveBeenCalledTimes(3);
    });
  });

  it('exclut les dossiers INPI sans siège et conserve les organisations identifiées', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        results: [
          { ...resultatSirene(), nom_complet: 'Dossier INPI 1', siege: {}, matching_etablissements: [] },
          resultatSirene(),
          { ...resultatSirene(), nom_complet: 'Dossier INPI 2', siege: {}, matching_etablissements: [] },
        ],
      },
    });
    const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

    const resultats = await adaptateur.rechercheOrganisations('Inpi', null);

    expect(resultats).toHaveLength(1);
    expect(resultats[0].siret).toBe('18008001200248');
    expect(resultats[0].nom).toBe('Organisation');
  });

  it('conserve un établissement identifié même lorsque son siège est vide', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: { results: [{ ...resultatSirene(), siege: {} }] },
    });
    const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

    const resultats = await adaptateur.rechercheOrganisations('18008001200248', null);

    expect(resultats).toHaveLength(1);
    expect(resultats[0].siret).toBe('18008001200248');
    expect(resultats[0].departement).toBe('92');
  });

  it.each([
    ['97105', '971'],
    ['98735', '987'],
    ['2A004', '2A'],
  ])(`extrait le département $1 de la commune $0`, async (commune, departement) => {
    const resultat = resultatSirene();
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        results: [{ ...resultat, matching_etablissements: [{ ...resultat.matching_etablissements[0], commune }] }],
      },
    });
    const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

    const resultats = await adaptateur.rechercheOrganisations('18008001200248', null);

    expect(resultats).toHaveLength(1);
    expect(resultats[0].departement).toBe(departement);
  });

  it.each([undefined, []].map((etablissements) => ({ etablissements })))(
    "exclut un résultat sans établissement correspondant lors d'une recherche numérique ($etablissements)",
    async ({ etablissements }) => {
      vi.spyOn(axios, 'get').mockResolvedValue({
        data: { results: [{ ...resultatSirene(), matching_etablissements: etablissements }] },
      });
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      expect(await adaptateur.rechercheOrganisations('18008001200248', null)).toEqual([]);
    }
  );

  it.each([undefined, null, ''].flatMap((valeur) => ['departement', 'siret'].map((champ) => ({ valeur, champ }))))(
    `exclut un siège avec $champ à $valeur`,
    async ({ valeur, champ }) => {
      const resultat = resultatSirene();
      vi.spyOn(axios, 'get').mockResolvedValue({
        data: { results: [{ ...resultat, siege: { ...resultat.siege, [champ]: valeur } }] },
      });
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      expect(await adaptateur.rechercheOrganisations('Inpi', null)).toEqual([]);
    }
  );

  it.each([undefined, null, ''].flatMap((valeur) => ['commune', 'siret'].map((champ) => ({ valeur, champ }))))(
    `exclut un établissement avec $champ à $valeur lors d'une recherche numérique`,
    async ({ valeur, champ }) => {
      const resultat = resultatSirene();
      vi.spyOn(axios, 'get').mockResolvedValue({
        data: {
          results: [
            {
              ...resultat,
              matching_etablissements: [{ ...resultat.matching_etablissements[0], [champ]: valeur }],
            },
            resultat,
          ],
        },
      });
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      const resultats = await adaptateur.rechercheOrganisations('18008001200248', null);

      expect(resultats).toHaveLength(1);
      expect(resultats[0].siret).toBe('18008001200248');
      expect(resultats[0].departement).toBe('92');
    }
  );

  describe('pour une organisation détaillée', () => {
    it("renvoie les données de l'API renommées sans underscore", async () => {
      const resultat = resultatSirene();
      vi.spyOn(axios, 'get').mockResolvedValue({
        data: {
          results: [
            {
              ...resultat,
              matching_etablissements: [
                { ...resultat.matching_etablissements[0], region: '11', tranche_effectif_salarie: '41' },
              ],
              section_activite_principale: 'O',
              nature_juridique: '7120',
              categorie_entreprise: 'ETI',
              finances: { '2024': { ca: 1_500_000, resultat_net: 10_000 } },
              complements: {
                est_association: false,
                collectivite_territoriale: null,
                identifiant_association: null,
                est_administration: true,
              },
            },
          ],
        },
      });
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      const organisation = await adaptateur.rechercheOrganisationDetaillee('18008001200248');

      expect(organisation).toEqual({
        natureJuridique: '7120',
        categorieEntreprise: 'ETI',
        trancheEffectifSalarie: '41',
        finances: { '2024': { ca: 1_500_000, resultatNet: 10_000 } },
        complements: {
          collectiviteTerritoriale: null,
          estAssociation: false,
          identifiantAssociation: null,
          estAdministration: true,
        },
        sectionActivitePrincipale: 'O',
        departement: '92',
        region: '11',
      });
    });

    it('renvoie des valeurs nulles quand les données sont absentes', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({ data: { results: [resultatSirene()] } });
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      const organisation = await adaptateur.rechercheOrganisationDetaillee('18008001200248');

      expect(organisation).toMatchObject({
        natureJuridique: null,
        categorieEntreprise: null,
        trancheEffectifSalarie: null,
        finances: null,
        region: null,
      });
    });

    it("renvoie undefined quand l'entité n'a pas d'établissement correspondant", async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({
        data: { results: [{ ...resultatSirene(), matching_etablissements: [] }] },
      });
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      expect(await adaptateur.rechercheOrganisationDetaillee('18008001200248')).toBeUndefined();
    });

    it('renvoie undefined quand aucun établissement ne correspond', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({ data: { results: [] } });
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      expect(await adaptateur.rechercheOrganisationDetaillee('18008001200248')).toBeUndefined();
    });

    it("lève l'erreur de l'API au lieu de renvoyer un résultat vide", async () => {
      vi.spyOn(axios, 'get').mockRejectedValue(new Error('API indisponible'));
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      await expect(adaptateur.rechercheOrganisationDetaillee('18008001200248')).rejects.toThrow('API indisponible');
    });

    it('ne met pas le résultat en cache', async () => {
      const get = vi.spyOn(axios, 'get').mockResolvedValue({ data: { results: [resultatSirene()] } });
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement, fauxRapporteur);

      await adaptateur.rechercheOrganisationDetaillee('18008001200248');
      await adaptateur.rechercheOrganisationDetaillee('18008001200248');

      expect(get).toHaveBeenCalledTimes(2);
    });
  });
});
