import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { ModuleTermine } from './evenements/moduleTermine.js';

export const consigneEvenementModuleTerminéDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async function (evenement: ModuleTermine) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurHachage.hache(evenement.email),
        idModule: evenement.idModule,
        nomModule: evenement.nomModule,
        parcours: evenement.parcours,
      },
      type: 'MODULE_TERMINE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
