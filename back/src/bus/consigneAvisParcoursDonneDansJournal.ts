import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { AvisParcoursDonné } from './evenements/avisParcoursDonne.js';

export const consigneAvisParcoursDonnéDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async (évènement: AvisParcoursDonné) => {
    const idUtilisateur = évènement.emailDeContact ? adaptateurHachage.hache(évènement.emailDeContact) : undefined;
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur,
        niveauDUtilité: évènement.niveauDUtilité,
        recommandationAutreOrganisation: évènement.recommandationAutreOrganisation,
        commentaireAmélioration: évènement.commentaireAmélioration,
        souhaiteÊtreRecontacté: évènement.souhaiteÊtreRecontacté,
        parcours: évènement.parcours,
        pageSource: évènement.pageSource,
      },
      type: 'AVIS_PARCOURS_DONNE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
