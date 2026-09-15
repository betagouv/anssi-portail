import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { SimulationRéflexesCyberRéponseSoumise } from './evenements/simulationReflexesCyberReponseSoumise.js';

export const consigneRéflexesCyberReponseSoumiseDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async (evenement: SimulationRéflexesCyberRéponseSoumise) => {
    const idUtilisateur = evenement.email ? adaptateurHachage.hache(evenement.email) : undefined;
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idCorrélation: evenement.idCorrélation,
        idScénario: evenement.idScénario,
        idRôle: evenement.idRôle,
        numéroÉvènement: evenement.numéroÉvènement,
        réflexe: evenement.réflexe,
        ...(idUtilisateur && { idUtilisateur }),
        ...(evenement.codeRegion && { codeRegion: evenement.codeRegion }),
        ...(evenement.codeSecteur && { codeSecteur: evenement.codeSecteur }),
        ...(evenement.codeTrancheEffectif && { codeTrancheEffectif: evenement.codeTrancheEffectif }),
      },
      type: 'SIMULATION_REFLEXES_CYBER_REPONSE_SOUMISE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
