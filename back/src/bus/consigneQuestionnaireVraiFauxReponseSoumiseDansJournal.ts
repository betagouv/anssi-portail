import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { QuestionnaireVraiFauxRéponseSoumise } from './evenements/questionnaireVraiFauxReponseSoumise.js';

export const consigneQuestionnaireVraiFauxReponseSoumiseDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async (evenement: QuestionnaireVraiFauxRéponseSoumise) => {
    const idUtilisateur = evenement.email ? adaptateurHachage.hache(evenement.email) : undefined;
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idCorrélation: evenement.idCorrélation,
        idQuestion: evenement.idQuestion,
        réponseCorrecte: evenement.réponseCorrecte,
        ...(idUtilisateur && { idUtilisateur }),
        ...(evenement.codeRegion && { codeRegion: evenement.codeRegion }),
        ...(evenement.codeSecteur && { codeSecteur: evenement.codeSecteur }),
        ...(evenement.codeTrancheEffectif && { codeTrancheEffectif: evenement.codeTrancheEffectif }),
      },
      type: 'QUESTIONNAIRE_VRAI_FAUX_REPONSE_SOUMISE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
