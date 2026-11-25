import { describe, expect, it } from 'vitest';
import { ServiceObservatoire } from '../../src/metier/serviceObservatoire.js';

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
      });
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
