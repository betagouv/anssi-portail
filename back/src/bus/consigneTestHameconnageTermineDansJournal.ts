import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { TestHameçonnageTerminé } from './evenements/testHameconnageTermine.js';

export const consigneTestHameconnageTermineDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async (evenement: TestHameçonnageTerminé) => {
    const idUtilisateur = evenement.email ? adaptateurHachage.hache(evenement.email) : undefined;
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idCorrélation: evenement.idCorrélation,
        ...(idUtilisateur && { idUtilisateur }),
        ...(evenement.codeRegion && { codeRegion: evenement.codeRegion }),
        ...(evenement.codeSecteur && { codeSecteur: evenement.codeSecteur }),
        ...(evenement.codeTrancheEffectif && { codeTrancheEffectif: evenement.codeTrancheEffectif }),
      },
      type: 'TEST_HAMECONNAGE_TERMINE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
