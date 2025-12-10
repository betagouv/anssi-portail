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

export const guideZeroTrust = new Guide({
  id: 'zero-trust',
  nom: 'Zero Trust',
  description:
    '<p>Avec l’accroissement des usages liés au télétravail, à la pratique du « Bring Your Own Device » (BYOD) et aux accès hétérogènes à des services on-premise ou dans le cloud, les produits dérivés du modèle Zero Trust sont promus par les éditeurs.</p><p> Les produits dits Zero Trust sont vus comme des solutions permettant de pallier certaines limitations des mesures traditionnelles telles que la protection des flux par VPN ou le filtrage réseau par des pares-feux périmétriques. Bien souvent, les modèles Zero Trust et de défense périmétrique sont opposés alors qu’ils sont complémentaires et partagent de nombreux principes communs. Ainsi le modèle Zero Trust doit être inclus dans une stratégie de défense en profondeur et il ne doit en aucun cas être vu comme un remplacement d’une défense périmétrique.</p><p> Le principal objectif de ce modèle est de réduire la confiance implicite accordée à un sujet souhaitant accéder au système d’information (SI). Il apporter un éclairage complémentaire à l’avis scientifique et technique de l’ANSSI publié en 2021 sur le modèle Zero Trust et sur la manière dont il peut être mis en œuvre progressivement dans le cadre d’une stratégie de défense en profondeur.</p>',
  nomImage: 'anssi-fondamentaux-zero-trust-v1_publication',
  langue: 'FR',
  collections: ['Les essentiels'],
  documents: [
    {
      libelle: 'Les Fondamentaux de l&#039;ANSSI - Zero Trust - v1.0',
      nomFichier: 'anssi-fondamentaux-zero-trust-v1.0.pdf',
    },
  ],
  dateMiseAJour: '20 Juin 2025',
  datePublication: '20 Juin 2025',
  thematique: 'Les essentiels',
  besoins: ['REAGIR', 'SE_FORMER'],
});

export const guideDevsecops = new Guide({
  id: 'devsecops',
  nom: 'DevSecOps',
  description:
    '<p>Les Essentiels de l’ANSSI visent à éclairer l’ensemble de nos lecteurs, quel que soit leur niveau de connaissance technique, sur les grands enjeux de la cybersécurité. Ils reflètent le point de vue de l’agence au moment de leur publication et ne se positionnent pas comme des documents de recommandations détaillées, comme nos guides. Il s’agit plutôt de l’énonciation de bonnes pratiques indépendantes pouvant être mises en place de façon complémentaire. Ces recommandations sont susceptibles d’être mises à jour régulièrement suivant l’évolution de la menace, des technologies utilisées, de nos retours d’expérience, etc.</p>',
  nomImage: 'anssi_essentiels_devsecops_v1',
  langue: 'FR',
  collections: ['Les essentiels'],
  documents: [
    {
      libelle: 'Les Essentiels de l&#039;ANSSI - DevSecOps - v1.0',
      nomFichier: 'anssi_essentiels_devsecops_v1.0.pdf',
    },
  ],
  dateMiseAJour: '13 Mars 2024',
  datePublication: '13 Mars 2024',
  thematique: 'Les essentiels',
  besoins: ['SECURISER'],
});
