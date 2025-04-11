import { Utilisateur } from '../../src/metier/utilisateur';
import { fauxAdaptateurRechercheEntreprise } from './fauxObjets';

export const jeanneDupont: Utilisateur = new Utilisateur(
  {
    email: 'jeanne.dupont@user.com',
    prenom: 'Jeanne',
    nom: 'Dupont',
    telephone: '0123456789',
    domainesSpecialite: ['RSSI'],
    siretEntite: '13000766900018',
    cguAcceptees: true,
    infolettreAcceptee: true,
  },
  fauxAdaptateurRechercheEntreprise
);
