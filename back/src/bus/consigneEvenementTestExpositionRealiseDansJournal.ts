import { TestExpositionRéalisé } from './evenements/TestExpositionRealise.js';
import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';

export const consigneEvenementTestExpositionRealiseDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async function (evenement: TestExpositionRéalisé) {
    const idUtilisateur = evenement.email ? adaptateurHachage.hache(evenement.email) : undefined;
    await adaptateurJournal.consigneEvenement({
      donnees: {
        typeOrganisation: evenement.typeOrganisation,
        secteur: evenement.secteur,
        facteursAggravant: evenement.facteursAggravant,
        ...(idUtilisateur && { idUtilisateur }),
        ...(evenement.codeRegion && { codeRegion: evenement.codeRegion }),
        ...(evenement.codeSecteur && { codeSecteur: evenement.codeSecteur }),
        ...(evenement.codeTrancheEffectif && { codeTrancheEffectif: evenement.codeTrancheEffectif }),
      },
      type: 'TEST_EXPOSITION_REALISE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
