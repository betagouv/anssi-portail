import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { RéponseVraieFausseSoumise } from './evenements/reponseVraieFausseSoumise.js';

export const consigneReponseVraieFausseSoumiseDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async (evenement: RéponseVraieFausseSoumise) => {
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
      type: 'REPONSE_VRAIE_FAUSSE_SOUMISE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
