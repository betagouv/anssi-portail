import { BusEvenements } from '../../../bus/busEvenements.js';
import { QuestionnaireVraiFauxRéponseSoumise } from '../../../bus/evenements/questionnaireVraiFauxReponseSoumise.js';
import { QuestionnaireVraiFauxTerminé } from '../../../bus/evenements/questionnaireVraiFauxTermine.js';
import { CodeRégion } from '../../referentielRegions.js';
import { CodeSecteur } from '../../referentielSecteurs.js';
import { CodeTrancheEffectif } from '../../referentielTranchesEffectifEtablissement.js';
import { Utilisateur } from '../../utilisateur.js';
import { EntrepôtRésultatTestVraiFaux } from './entrepotResultatTestVraiFaux.js';
import { QuestionVraieFausse } from './questionVraieFausse.js';
import { RésultatTestVraiFaux } from './resultatTestVraiFaux.js';

export class QuestionnaireVraiFaux {
  constructor(private readonly questions: QuestionVraieFausse[]) {}

  évalueRéponse = async ({
    entrepôtRésultatTestVraiFaux,
    busÉvénements,
    idCorrélation,
    idQuestion,
    réponseUtilisateur,
    utilisateur,
    score,
  }: {
    entrepôtRésultatTestVraiFaux: EntrepôtRésultatTestVraiFaux;
    busÉvénements: BusEvenements;
    idCorrélation: string;
    idQuestion: string;
    réponseUtilisateur: boolean;
    utilisateur?: Utilisateur;
    score: string;
  }) => {
    const question = this.questions.find((q) => q.idQuestion === idQuestion);
    if (!question) {
      throw new Error('réponse à une question inconnue : ' + idQuestion);
    }
    let email: string | undefined;
    let codeRegion: CodeRégion | undefined;
    let codeSecteur: CodeSecteur | undefined;
    let codeTrancheEffectif: CodeTrancheEffectif | undefined;

    if (utilisateur) {
      email = utilisateur.email;
      codeRegion = await utilisateur.codeRegion();
      codeSecteur = await utilisateur.codeSecteur();
      codeTrancheEffectif = await utilisateur.codeTrancheEffectif();
    }

    await busÉvénements.publie(
      new QuestionnaireVraiFauxRéponseSoumise({
        idCorrélation,
        idQuestion,
        réponseCorrecte: réponseUtilisateur === question?.idéeReçueEstVraie,
        email,
        codeRegion,
        codeSecteur,
        codeTrancheEffectif,
      })
    );

    if (idQuestion === this.questions.at(-1)?.idQuestion) {
      if (utilisateur) {
        await entrepôtRésultatTestVraiFaux.ajoute(
          new RésultatTestVraiFaux({
            utilisateur,
            score,
          })
        );
      }

      await busÉvénements.publie(
        new QuestionnaireVraiFauxTerminé({
          idCorrélation,
          email,
          codeRegion,
          codeSecteur,
          codeTrancheEffectif,
        })
      );
    }
  };
}
