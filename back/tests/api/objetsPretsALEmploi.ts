import { Financement } from '../../src/metier/financement';
import { Guide } from '../../src/metier/guide';
import { Module } from '../../src/metier/module';
import { ExigenceNIS2 } from '../../src/metier/nis2/exigence';
import { Utilisateur } from '../../src/metier/utilisateur';
import { fauxAdaptateurHachage, fauxAdaptateurRechercheEntreprise } from './fauxObjets';
import { mesureDeTest } from './mesures/constructeurDeMesure';

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
    roles: ['GESTION_GUIDES'],
  },
  fauxAdaptateurRechercheEntreprise,
  fauxAdaptateurHachage
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
  fauxAdaptateurRechercheEntreprise,
  fauxAdaptateurHachage
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

export const guideZeroTrust = () =>
  new Guide({
    id: 'zero-trust',
    nom: 'Zero Trust',
    description:
      '<p>Avec l’accroissement des usages liés au télétravail, à la pratique du « Bring Your Own Device » (BYOD) et aux accès hétérogènes à des services on-premise ou dans le cloud, les produits dérivés du modèle Zero Trust sont promus par les éditeurs.</p><p> Les produits dits Zero Trust sont vus comme des solutions permettant de pallier certaines limitations des mesures traditionnelles telles que la protection des flux par VPN ou le filtrage réseau par des pares-feux périmétriques. Bien souvent, les modèles Zero Trust et de défense périmétrique sont opposés alors qu’ils sont complémentaires et partagent de nombreux principes communs. Ainsi le modèle Zero Trust doit être inclus dans une stratégie de défense en profondeur et il ne doit en aucun cas être vu comme un remplacement d’une défense périmétrique.</p><p> Le principal objectif de ce modèle est de réduire la confiance implicite accordée à un sujet souhaitant accéder au système d’information (SI). Il apporter un éclairage complémentaire à l’avis scientifique et technique de l’ANSSI publié en 2021 sur le modèle Zero Trust et sur la manière dont il peut être mis en œuvre progressivement dans le cadre d’une stratégie de défense en profondeur.</p>',
    langue: 'FR',
    collections: ['Les essentiels'],
    listeDocuments: [
      {
        libelle: 'Les Fondamentaux de l&#039;ANSSI - Zero Trust - v1.0',
        nomFichier: 'anssi-fondamentaux-zero-trust-v1.0.pdf',
      },
    ],
    dateMiseAJour: new Date(2025, 5, 20),
    thematique: 'Les essentiels',
    besoins: ['REAGIR', 'SE_FORMER'],
    lienCourt: 'https://cyber.gouv.fr/fondamentaux-zero-trust',
  });

export const guideDevsecops = () =>
  new Guide({
    id: 'devsecops',
    nom: 'DevSecOps',
    description:
      '<p>Les Essentiels de l’ANSSI visent à éclairer l’ensemble de nos lecteurs, quel que soit leur niveau de connaissance technique, sur les grands enjeux de la cybersécurité. Ils reflètent le point de vue de l’agence au moment de leur publication et ne se positionnent pas comme des documents de recommandations détaillées, comme nos guides. Il s’agit plutôt de l’énonciation de bonnes pratiques indépendantes pouvant être mises en place de façon complémentaire. Ces recommandations sont susceptibles d’être mises à jour régulièrement suivant l’évolution de la menace, des technologies utilisées, de nos retours d’expérience, etc.</p>',
    langue: 'FR',
    collections: ['Les essentiels'],
    listeDocuments: [
      {
        libelle: 'Les Essentiels de l&#039;ANSSI - DevSecOps - v1.0',
        nomFichier: 'anssi_essentiels_devsecops_v1.0.pdf',
      },
    ],
    dateMiseAJour: new Date(2024, 2, 13),
    thematique: 'Les essentiels',
    besoins: ['SECURISER'],
  });

const aujourdhui = new Date();

export const guidePublieDemain = () =>
  new Guide({
    id: 'devsecops',
    nom: 'DevSecOps',
    description:
      '<p>Les Essentiels de l’ANSSI visent à éclairer l’ensemble de nos lecteurs, quel que soit leur niveau de connaissance technique, sur les grands enjeux de la cybersécurité. Ils reflètent le point de vue de l’agence au moment de leur publication et ne se positionnent pas comme des documents de recommandations détaillées, comme nos guides. Il s’agit plutôt de l’énonciation de bonnes pratiques indépendantes pouvant être mises en place de façon complémentaire. Ces recommandations sont susceptibles d’être mises à jour régulièrement suivant l’évolution de la menace, des technologies utilisées, de nos retours d’expérience, etc.</p>',
    langue: 'FR',
    collections: ['Les essentiels'],
    listeDocuments: [
      {
        libelle: 'Les Essentiels de l&#039;ANSSI - DevSecOps - v1.0',
        nomFichier: 'anssi_essentiels_devsecops_v1.0.pdf',
      },
    ],
    dateMiseAJour: new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), aujourdhui.getDate() + 1),
    thematique: 'Les essentiels',
    besoins: ['SECURISER'],
  });

export const moduleCyberdépart = new Module(1, 'Cyberdépart');

export const mesureAuthentA2Etapes = () => {
  const exigence = new ExigenceNIS2({
    reference: '10.B.5-EI/EE',
    entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
    objectifSecurite:
      'Objectif de sécurité 10: Gestion des identités et des accès des utilisateurs aux systèmes d’information',
    thematique: 'Authentification',
    contenu: 'Les facteurs d’authentification...',
    contenuEnAnglais: 'The authentication factors...',
  });

  return mesureDeTest()
    .avecLId('AUTH.5')
    .avecLeTitre(
      'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes'
    )
    .avecLaPhraseAccroche('Empêchez qu’un compte soit utilisé, même si le mot de passe a fuité 💨')
    .avecLesExplications(
      `Un mot de passe seul ne suffit pas toujours à protéger un compte. En activant une deuxième vérification, vous ajoutez une sécurité supplémentaire au moment de la connexion : un code reçu sur une application, une clé physique, une empreinte digitale ou, à défaut, un code par SMS.

Ainsi, même si un mot de passe est volé ou deviné, l’accès au compte reste beaucoup plus difficile pour une personne malveillante.`
    )
    .avecLActionPrioritaire(
      `Mettre en oeuvre la vérification en deux étapes sur les services importants, a minima :
* l’accès aux mails,
* les services en ligne,
* tous les accès distants (ex. télétravail),
* les comptes d’administration.`
    )
    .avecLActionFacileAFaire(
      `Dans les principales suites collaboratives (La Suite Numérique, Microsoft 365, Google Workspace, etc.), la vérification en deux étapes est incluse — il suffit de l’activer dans les paramètres de sécurité, sans surcoût ni outil supplémentaire.`
    )
    .avecLOrdre(10)
    .avecUnRisque(
      'Un compte utilise a votre place',
      'par exemple si le mot de passe a ete vole apres un faux email, une fuite de donnees ou un virus sur un ordinateur.'
    )
    .avecUnRisque(
      'Un acces non autorise a un outil en ligne',
      'cela peut concerner une messagerie, un logiciel de gestion, un espace client, un compte bancaire, un reseau social ou un outil d’administration accessible depuis internet.'
    )
    .avecUnRisque(
      'Connexion frauduleuse sans alerte',
      'sans verification en deux etapes, une connexion reussie avec votre mot de passe ne declenche aucun signal — un attaquant peut consulter vos mails ou agir en votre nom pendant des jours sans que vous le remarquiez.'
    )
    .avecUnLien(
      'Guide ANSSI — Recommandations relatives à l’authentification multifacteur et aux mots de passe',
      'https://cyber.gouv.fr/publications/recommandations-relatives-lauthentification-multifacteur-et-aux-mots-de-passe'
    )
    .avecUneExigence(exigence)
    .construis();
};
