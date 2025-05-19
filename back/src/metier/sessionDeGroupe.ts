import { GenerateurCodeSessionDeGroupe } from './generateurCodeSessionDeGroupe';
import { EntrepotResultatTest } from './entrepotResultatTest';
import { IdNiveauMaturite, ResultatTestMaturite } from './resultatTestMaturite';

export class SessionDeGroupe {
  constructor(public readonly code: string) {}

  static async cree(
    generateurCodeSessionDeGroupe: GenerateurCodeSessionDeGroupe
  ) {
    const code = await generateurCodeSessionDeGroupe.genere();
    return new SessionDeGroupe(code);
  }

  async resultatSession(entrepotResultatTest: EntrepotResultatTest) {
    const resultatsTest = await entrepotResultatTest.ceuxDeSessionGroupe(
      this.code
    );

    const objetVide: Record<IdNiveauMaturite, ResultatTestMaturite[]> = {
      insuffisant: [],
      emergent: [],
      intermediaire: [],
      confirme: [],
      optimal: [],
    };
    const resultatsParNiveau = resultatsTest.reduce((niveaux, resultatTest) => {
      niveaux[resultatTest.niveau()].push(resultatTest);
      return niveaux;
    }, objetVide);

    return {
      nombreParticipants: resultatsTest.length,
      resume: {
        insuffisant: {
          total: resultatsParNiveau.insuffisant.length,
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
          total: resultatsParNiveau.emergent.length,
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
          total: resultatsParNiveau.intermediaire.length,
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
          total: resultatsParNiveau.confirme.length,
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
          total: resultatsParNiveau.optimal.length,
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
