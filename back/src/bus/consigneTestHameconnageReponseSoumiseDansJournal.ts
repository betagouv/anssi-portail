import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { TestHameçonnageRéponseSoumise } from './evenements/testHameconnageReponseSoumise.js';

export const consigneTestHameconnageReponseSoumiseDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async (evenement: TestHameçonnageRéponseSoumise) => {
    const idUtilisateur = evenement.email ? adaptateurHachage.hache(evenement.email) : undefined;
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idCorrélation: evenement.idCorrélation,
        idMail: evenement.idMail,
        réponseCorrecte: evenement.réponseCorrecte,
        ...(idUtilisateur && { idUtilisateur }),
        ...(evenement.codeRegion && { codeRegion: evenement.codeRegion }),
        ...(evenement.codeSecteur && { codeSecteur: evenement.codeSecteur }),
        ...(evenement.codeTrancheEffectif && { codeTrancheEffectif: evenement.codeTrancheEffectif }),
        ...(evenement.parcours && { parcours: evenement.parcours }),
      },
      type: 'TEST_HAMECONNAGE_REPONSE_SOUMISE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
