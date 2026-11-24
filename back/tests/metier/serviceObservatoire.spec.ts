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

  describe('sur demande des données de projets', () => {
    it("agrège les résultats de l'adaptateur MSS, en y ajoutant la source et la date", async () => {
      const observatoire = new ServiceObservatoire({
        adaptateurObservatoireMSS,
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
});
