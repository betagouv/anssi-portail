import { BusEvenements } from '../../../bus/busEvenements.js';
import { QuestionnaireVraiFauxTerminé } from '../../../bus/evenements/questionnaireVraiFauxTermine.js';
import { RéponseVraieFausseSoumise } from '../../../bus/evenements/reponseVraieFausseSoumise.js';
import { CodeRegion } from '../../referentielRegions.js';
import { CodeSecteur } from '../../referentielSecteurs.js';
import { CodeTrancheEffectif } from '../../referentielTranchesEffectifEtablissement.js';
import { Utilisateur } from '../../utilisateur.js';
import { QuestionVraieFausse } from './questionVraieFausse.js';

export class QuestionnaireVraiFaux {
  constructor(private readonly questions: QuestionVraieFausse[]) {}

  évalueRéponse = async ({
    busÉvénements,
    idCorrélation,
    idQuestion,
    réponseUtilisateur,
    utilisateur,
  }: {
    busÉvénements: BusEvenements;
    idCorrélation: string;
    idQuestion: string;
    réponseUtilisateur: boolean;
    utilisateur?: Utilisateur;
  }) => {
    const question = this.questions.find((q) => q.idQuestion === idQuestion);
    if (!question) {
      throw new Error('réponse à une question inconnue : ' + idQuestion);
    }
    let email: string | undefined;
    let codeRegion: CodeRegion | undefined;
    let codeSecteur: CodeSecteur | undefined;
    let codeTrancheEffectif: CodeTrancheEffectif | undefined;

    if (utilisateur) {
      email = utilisateur.email;
      codeRegion = await utilisateur.codeRegion();
      codeSecteur = await utilisateur.codeSecteur();
      codeTrancheEffectif = await utilisateur.codeTrancheEffectif();
    }
    await busÉvénements.publie(
      new RéponseVraieFausseSoumise({
        idCorrélation,
        idQuestion,
        réponseCorrecte: réponseUtilisateur === question?.idéeReçueEstVraie,
        email,
        codeRegion,
        codeSecteur,
        codeTrancheEffectif,
      })
    );

    if (idQuestion === this.questions.at(-1)?.idQuestion)
      await busÉvénements.publie(
        new QuestionnaireVraiFauxTerminé({
          idCorrélation,
          email,
          codeRegion,
          codeSecteur,
          codeTrancheEffectif,
        })
      );
  };
}
