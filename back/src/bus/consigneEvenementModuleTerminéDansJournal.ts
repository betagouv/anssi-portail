import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { ModuleTermine } from './evenements/moduleTermine';

export const consigneEvenementModuleTerminéDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: ModuleTermine) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: evenement.emailHache,
        idModule: evenement.idModule,
        nomModule: evenement.nomModule,
      },
      type: 'MODULE_TERMINE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
