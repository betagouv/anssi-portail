import { GenerateurCodeSessionDeGroupe } from './generateurCodeSessionDeGroupe';
import { EntrepotResultatTest } from './entrepotResultatTest';

export class SessionDeGroupe {
  constructor(public readonly code: string) {}

  static async cree(
    generateurCodeSessionDeGroupe: GenerateurCodeSessionDeGroupe
  ) {
    const code = await generateurCodeSessionDeGroupe.genere();
    return new SessionDeGroupe(code);
  }

  async resultatSession(entrepotResultatTest: EntrepotResultatTest) {
    const testsMaturite = await entrepotResultatTest.ceuxDeSessionGroupe(
      this.code
    );

    return {
      nombreParticipants: testsMaturite.length,
      resume: {
        insuffisant: {
          total: 0,
          moyennes: {
            'prise-en-compte-risque': 0,
            pilotage: 0,
            budget: 0,
            'ressources-humaines': 0,
            'adoption-solutions': 0,
            posture: 0,
          },
        },
        emergent: {
          total: 0,
          moyennes: {
            'prise-en-compte-risque': 0,
            pilotage: 0,
            budget: 0,
            'ressources-humaines': 0,
            'adoption-solutions': 0,
            posture: 0,
          },
        },
        intermediaire: {
          total: 0,
          moyennes: {
            'prise-en-compte-risque': 0,
            pilotage: 0,
            budget: 0,
            'ressources-humaines': 0,
            'adoption-solutions': 0,
            posture: 0,
          },
        },
        confirme: {
          total: 0,
          moyennes: {
            'prise-en-compte-risque': 0,
            pilotage: 0,
            budget: 0,
            'ressources-humaines': 0,
            'adoption-solutions': 0,
            posture: 0,
          },
        },
        optimal: {
          total: 0,
          moyennes: {
            'prise-en-compte-risque': 0,
            pilotage: 0,
            budget: 0,
            'ressources-humaines': 0,
            'adoption-solutions': 0,
            posture: 0,
          },
        },
      },
    };
  }
}
