import { BusEvenements } from '../../../bus/busEvenements.js';
import { QuestionnaireVraiFauxTerminé } from '../../../bus/evenements/questionnaireVraiFauxTermine.js';
import { RéponsesVraieFausseSoumise } from '../../../bus/evenements/reponsesVraieFausseSoumise.js';
import { QuestionVraieFausse } from './questionVraieFausse.js';

export class QuestionnaireVraiFaux {
  constructor(private readonly questions: QuestionVraieFausse[]) {}

  évalueRéponse = async ({
    busÉvénements,
    idCorrélation,
    idQuestion,
    réponseUtilisateur,
  }: {
    busÉvénements: BusEvenements;
    idCorrélation: string;
    idQuestion: string;
    réponseUtilisateur: boolean;
  }) => {
    const question = this.questions.find((q) => q.idQuestion === idQuestion);
    if (!question) {
      throw new Error('réponse à une question inconnue : ' + idQuestion);
    }
    await busÉvénements.publie(
      new RéponsesVraieFausseSoumise({
        idCorrélation,
        idQuestion,
        réponseCorrecte: réponseUtilisateur === question?.idéeReçueEstVraie,
      })
    );

    if (idQuestion === this.questions.at(-1)?.idQuestion)
      await busÉvénements.publie(
        new QuestionnaireVraiFauxTerminé({
          idCorrélation,
        })
      );
  };
}
