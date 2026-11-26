import { describe, expect, it } from 'vitest';

import { SeuilCompletion } from '@metier/observatoire.js';
import { departements } from '@metier/referentielDepartements.js';
import { ServiceObservatoire } from '@metier/serviceObservatoire.js';
import { DATE_MAJ_NOMBRES_DE_DIAGNOSTIC_CYBER, NOMBRES_DE_DIAGNOSTIC_CYBER } from '@metier/statistiques.js';

describe('Le service Observatoire', () => {
  const adaptateurObservatoireMSS = {
    totalServices: async () => 3,
    cumulMensuelServices: async () => [{ mois: '2026-01', cumul: 3 }],
    mesuresFaitesParMois: async () => [{ mois: '2026-01', total: 42 }],
    servicesParNiveauSecurite: async () => [{ niveauSecurite: 'Modérés', total: 3 }],
    cumulMensuelHomologations: async () => [{ mois: '2026-01', cumul: 1 }],
    dateDerniereExecution: async () => new Date('2026-02-01T08:00:00.000Z'),
  };

  const adaptateurObservatoireMSC = {
    totalTestsMaturite: async () => 5,
    testsMaturiteParNiveau: async () => [
      { niveau: 'Émergent', total: 3 },
      { niveau: 'Optimal', total: 2 },
    ],
    totalTestsSensibilisation: async () => 12,
    cumulMensuelTestsSensibilisation: async () => [{ mois: '2026-02', cumul: 12 }],
    totalParcoursRejoints: async () => 7,
    totalCyberdepartsValides: async () => 4,
    cumulMensuelCyberdepartsValides: async () => [{ mois: '2026-02', cumul: 4 }],
    cyberdepartsValidesParDepartement: async () => [{ departement: '35', total: 2 }],
    totalCompletions: async (seuil: SeuilCompletion) => 100 - seuil,
    cumulMensuelCompletions: async (seuil: SeuilCompletion) => [{ mois: '2026-02', cumul: 100 - seuil }],
    completionsParDepartement: async (seuil: SeuilCompletion) => [{ departement: '2A', total: seuil }],
    dateDerniereExecution: async () => new Date('2026-03-01T02:30:00.000Z'),
  };

  const donneesMenaceCyber = {
    evenementsSecurite: {
      total: '3 586',
      source: 'ANSSI, Panorama de la Cybermenace 2025',
      date: null,
    },
    incidents: {
      total: '1 366',
      source: 'ANSSI, Panorama de la Cybermenace 2025',
      date: null,
    },
    rançongiciels: {
      total: '48 %',
      source: 'ANSSI, signalements 2025',
      date: null,
    },
    fraudesVirement: {
      total: '+170 %',
      source: 'Cybermalveillance.gouv.fr, demandes d’assistance 2025',
      date: null,
    },
    cyberharcèlements: {
      total: '+205 %',
      source: 'Cybermalveillance.gouv.fr, demandes d’assistance 2025',
      date: null,
    },
    volsDonnées: {
      total: '+51 %',
      source: 'ANSSI, signalements 2025',
      date: null,
    },
  };
  const adaptateurObservatoireMenaceCyber = {
    donnees: () => donneesMenaceCyber,
  };

  describe('sur demande des données de projets', () => {
    it("agrège les résultats de l'adaptateur MSS, en y ajoutant la source et la date", async () => {
      const observatoire = new ServiceObservatoire({
        adaptateurObservatoireMSS,
        adaptateurObservatoireMSC,
        adaptateurObservatoireMenaceCyber,
      });

      const donneesProjets = await observatoire.donneesProjets();

      expect(donneesProjets).toStrictEqual({
        services: {
          source: 'MonServiceSécurisé',
          date: new Date('2026-02-01T08:00:00.000Z'),
          total: 3,
          cumulMensuel: [{ mois: '2026-01', cumul: 3 }],
          parNiveauSecurite: [{ niveauSecurite: 'Modérés', total: 3 }],
        },
        mesuresFaites: {
          source: 'MonServiceSécurisé',
          date: new Date('2026-02-01T08:00:00.000Z'),
          parMois: [{ mois: '2026-01', total: 42 }],
        },
        homologations: {
          source: 'MonServiceSécurisé',
          date: new Date('2026-02-01T08:00:00.000Z'),
          cumulMensuel: [{ mois: '2026-01', cumul: 1 }],
        },
      });
    });
  });

  describe('sur demande des données des organisations', () => {
    it("agrège les résultats de l'adaptateur MSC, en y ajoutant la source et la date", async () => {
      const observatoire = new ServiceObservatoire({
        adaptateurObservatoireMSS,
        adaptateurObservatoireMSC,
        adaptateurObservatoireMenaceCyber,
      });

      const donneesOrganisations = await observatoire.donneesOrganisations();

      expect(donneesOrganisations).toStrictEqual({
        testsMaturite: {
          source: 'MesServicesCyber',
          date: new Date('2026-03-01T02:30:00.000Z'),
          total: 5,
          parNiveau: [
            { niveau: 'Émergent', total: 3 },
            { niveau: 'Optimal', total: 2 },
          ],
        },
        testsSensibilisation: {
          source: 'MesServicesCyber',
          date: new Date('2026-03-01T02:30:00.000Z'),
          total: 12,
          cumulMensuel: [{ mois: '2026-02', cumul: 12 }],
        },
        demarchesInitiees: {
          source: 'MesServicesCyber',
          date: new Date('2026-03-01T02:30:00.000Z'),
          total: 7 + NOMBRES_DE_DIAGNOSTIC_CYBER,
        },
        diagnosticsCyberdepart: {
          source: 'MesServicesCyber',
          date: DATE_MAJ_NOMBRES_DE_DIAGNOSTIC_CYBER,
          total: NOMBRES_DE_DIAGNOSTIC_CYBER,
        },
        cyberdepartsValides: {
          source: 'MesServicesCyber',
          date: new Date('2026-03-01T02:30:00.000Z'),
          total: 4,
          cumulMensuel: [{ mois: '2026-02', cumul: 4 }],
          parDepartement: expect.any(Array),
        },
        completions: {
          source: 'MesServicesCyber',
          date: new Date('2026-03-01T02:30:00.000Z'),
          parSeuil: [
            { seuil: 50, total: 50, cumulMensuel: [{ mois: '2026-02', cumul: 50 }], parDepartement: expect.any(Array) },
            { seuil: 80, total: 20, cumulMensuel: [{ mois: '2026-02', cumul: 20 }], parDepartement: expect.any(Array) },
            { seuil: 100, total: 0, cumulMensuel: [{ mois: '2026-02', cumul: 0 }], parDepartement: expect.any(Array) },
          ],
        },
      });
    });

    it('répartit les niveaux validés sur tous les départements, à zéro pour ceux sans donnée', async () => {
      const observatoire = new ServiceObservatoire({
        adaptateurObservatoireMSS,
        adaptateurObservatoireMSC,
        adaptateurObservatoireMenaceCyber,
      });

      const { cyberdepartsValides, completions } = await observatoire.donneesOrganisations();

      expect(cyberdepartsValides.parDepartement).toHaveLength(departements.length);
      expect(cyberdepartsValides.parDepartement).toContainEqual({ code: '35', nom: 'Ille-et-Vilaine', total: 2 });
      expect(cyberdepartsValides.parDepartement).toContainEqual({ code: '01', nom: 'Ain', total: 0 });
      expect(completions.parSeuil[1].parDepartement).toHaveLength(departements.length);
      expect(completions.parSeuil[1].parDepartement).toContainEqual({ code: '2A', nom: 'Corse-du-Sud', total: 80 });
    });

    const dateDesDemarches = async (dateDerniereExecution: Date | null) => {
      const observatoire = new ServiceObservatoire({
        adaptateurObservatoireMSS,
        adaptateurObservatoireMSC: {
          ...adaptateurObservatoireMSC,
          dateDerniereExecution: async () => dateDerniereExecution,
        },
        adaptateurObservatoireMenaceCyber,
      });
      return (await observatoire.donneesOrganisations()).demarchesInitiees.date;
    };

    it('date les démarches initiées du nombre de diagnostics lorsque la mise à jour est plus récente', async () => {
      expect(await dateDesDemarches(new Date('2999-01-01'))).toStrictEqual(DATE_MAJ_NOMBRES_DE_DIAGNOSTIC_CYBER);
    });

    it("ne date pas les démarches initiées tant que la mise à jour n'a jamais été exécutée", async () => {
      expect(await dateDesDemarches(null)).toBeNull();
    });
  });

  it('retourne les données de la cyber menace', () => {
    const observatoire = new ServiceObservatoire({
      adaptateurObservatoireMSS,
      adaptateurObservatoireMSC,
      adaptateurObservatoireMenaceCyber,
    });

    const donnees = observatoire.donneesMenaceCyber();

    expect(donnees).toStrictEqual(donneesMenaceCyber);
  });
});
