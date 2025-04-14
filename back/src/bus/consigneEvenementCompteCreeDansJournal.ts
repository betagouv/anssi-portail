import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { CompteCree } from './compteCree';

export interface AdaptateurChiffrement {
  hacheSha256: (valeur: string) => string;
}

export const consigneEvenementCompteCreeDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurChiffrement,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurChiffrement: AdaptateurChiffrement;
}) => {
  return async function (evenement: CompteCree) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurChiffrement.hacheSha256(evenement.email),
      },
      type: 'NOUVEL_UTILISATEUR_INSCRIT',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
