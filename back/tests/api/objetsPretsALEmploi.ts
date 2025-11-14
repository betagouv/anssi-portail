import { Financement } from '../../src/metier/financement';
import { Guide } from '../../src/metier/guide';
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

export const hectorDurant: Utilisateur = new Utilisateur(
  {
    email: 'hector.durant@mail.com',
    prenom: 'Hector',
    nom: 'Durant',
    telephone: '0123456789',
    domainesSpecialite: ['RSSI'],
    siretEntite: '13000766900018',
    cguAcceptees: true,
    infolettreAcceptee: true,
  },
  fauxAdaptateurRechercheEntreprise
);

export const financementCyberPME: Financement = new Financement({
  id: 1,
  nom: 'Cyber PME',
  financeur: 'BPI France',
  typesDeFinancement: ['Formation'],
  entitesElligibles: ['PME', 'ETI'],
  perimetresGeographiques: ['France'],
  regions: ['France'],
  objectifs: 'objectif 1',
  operationsEligibles: 'opération 2',
  benificiaires: 'Tout le monde',
  montant: 'Mille milliards',
  condition: 'Avoir 10 doigts',
  sources: ['Le Gorafi'],
  contact: 'aide.entreprise@mail.fr',
});

export const guideZeroTrust: Guide = {
  id: 'zero-trust',
  titre: 'Zero Trust',
  lienVignette:
    'https://cyber.gouv.fr/sites/default/files/image/anssi-fondamentaux-zero-trust-v1_publication.jpg',
  langue: 'FR',
  collections: ['Les essentiels'],
};

export const guideDevsecops: Guide = {
  id: 'devsecops',
  titre: 'DevSecOps',
  lienVignette:
    'https://cyber.gouv.fr/sites/default/files/image/anssi_essentiels_devsecops_v1.jpg',
  langue: 'FR',
  collections: ['Les essentiels'],
};
