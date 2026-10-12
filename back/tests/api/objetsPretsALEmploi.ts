import { Article } from '../../src/metier/blog/article.js';
import { Financement } from '../../src/metier/financement.js';
import { Guide } from '../../src/metier/guide.js';
import { QuestionVraieFausse } from '../../src/metier/mini-tests/vrai-faux/questionVraieFausse.js';
import { ExigenceNIS2 } from '../../src/metier/nis2/exigence.js';
import { Utilisateur } from '../../src/metier/utilisateur.js';
import { fauxAdaptateurHachage, fauxAdaptateurRechercheEntreprise } from './fauxObjets.js';
import { mesureDeTest } from './mesures/constructeurDeMesure.js';
import { ConstructeurDeModule } from './mesures/constructeurDeModule.js';

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
    pixelDeSuiviAccepté: true,
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
    pixelDeSuiviAccepté: true,
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

export const fabriqueModuleCyberdépart = () =>
  new ConstructeurDeModule()
    .avecLId(1)
    .avecLeNom('Cyberdépart')
    .avecLaDescription(
      "Le socle de départ de la sécurisation d'une organisation : les mesures les plus accessibles et les plus rentables, peu coûteuses et rapides à déployer, à mettre en place avant toute protection avancée."
    )
    .construis();

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
    .avecIdModule(3)
    .avecNomModule('Module 3')
    .construis();
};

export const questionVraieFaussePME: QuestionVraieFausse = {
  idQuestion: 'idQuestion1',
  idéeReçue: {
    emoji: '🏢',
    texte: 'Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.',
  },
  réponse: 'FAUX. Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.',
  explications: [
    'Les PME, TPE et ETI sont la catégorie la plus touchée.',
    "En 2025, parmi les victimes d'attaques par rançongiciel portées à la connaissance de l'ANSSI, les PME, TPE et ETI représentent 48 % des cas — c'est la catégorie la plus affectée. Les attaques cybercriminelles ciblent indistinctement la plupart des secteurs et zones géographiques, de façon opportuniste.",
  ],
  source: 'ANSSI, Panorama de la cybermenace 2025, section 1.A — pages 10-11.',
  idéeReçueEstVraie: false,
};

export const kitRelais: Article = {
  contenu: `<section><h2 id="-un-mail-cl-en-main-adresser-votre-communaut-">💡 Un mail clé-en-main à adresser à votre communauté !</h2><p>➡️ Les visuels à intégrer dans le mail sont accessibles <a href="https://fichiers.numerique.gouv.fr/explorer/items/9f08d261-a909-4645-8012-c4cd11930035" target="_blank" rel="nofollow">ici</a>.</p>
<h4 id="objet-cybers-curit-passez-l-39-action-">Objet : Cybersécurité : passez à l'action !</h4><p>Bonjour,</p>
<p>Les TPE/PME/ETI sont les premières victimes de cyberattaque en France. Toutes les entreprises, de toute taille, dans tous les secteurs sont exposées aux cybermenaces, y compris celui du [nom du secteur / domaine].</p>
<p>Pour vous aider à passer à l’action, <strong>la [nom de l'organisation] vous invite à découvrir</strong> <a href="https://messervices.cyber.gouv.fr/parcours-securisation?mtm_campaign=23-09-Kit-Parcours&amp;mtm_source=Kit&amp;mtm_medium=Multiple" target="_blank" rel="nofollow"><strong>MesServices.cyber.gouv.fr</strong></a>, <strong>une plateforme publique pour aider les entreprises à se protéger contre les cyberattaques</strong>, proposée par l’Agence nationale de la sécurité des systèmes d’information (ANSSI). Déjà +7 000 organisations accompagnées !</p>
<p>🚀 Sur MesServicesCyber, <strong>découvrez le programme de cybersécurité gratuit, en ligne et adaptée à votre niveau :</strong></p>
<ul>
<li><strong>🤔 La cybersécurité est étrangère à votre organisation ? Prenez votre cyberdépart avec 12 premières mesures simples et rapides</strong> à mettre en œuvre pour commencer à protéger votre organisation contre les cyberattaques :<ul>
<li>Des mesures pédagogiques, sans jargon, pratico-pratiques.</li>
<li>Des tutos, des outils pour vous aider à mettre en œuvre chaque mesure.</li>
<li>A la clé : décrochez votre badge cyberdépart !
<strong>→</strong> <a href="https://messervices.cyber.gouv.fr/parcours-cyberdepart" target="_blank" rel="nofollow">Prendre mon cyberdépart</a></li>
</ul>
</li>
<li><strong>💪 Votre organisation agit déjà pour sa cybersécurité ?</strong> Découvrez le parcours complet pour renforcer votre cybersécurité. 55 mesures pour vous protéger contre les principaux risques cyber, basées sur le Référentiel Cyber France (ReCyF) et faciliter la mise en conformité des entreprises concernées par NIS 2.
<strong>→</strong> <a href="https://messervices.cyber.gouv.fr/parcours-securisation-complet" target="_blank" rel="nofollow">Découvrir le parcours complet</a></li>
</ul>
<p>📲 Découvrez également sur <a href="messervices.cyber.gouv.fr" target="_blank" rel="nofollow">MesServicesCyber</a> les <strong>financements</strong> cyber disponibles pour soutenir vos efforts, les <strong>prestataires</strong> pour vous accompagner, tous les <strong>contacts</strong> de proximité pour vos orienter ou en cas d’incident ainsi que plusieurs <a href="https://messervices.cyber.gouv.fr/faire-le-test" target="_blank" rel="nofollow">tests cyber</a> pédagogiques pour mieux comprendre les risques cyber.</p>
<p>L'équipe [nom de l'organisation]</p>
</section>`,
  description:
    'Tous les éléments pour relayer MesServicesCyber et le parcours de sécurisation pour aider les entités à protéger leur organisation.',
  titre: '👋 Le kit relais MesServicesCyber',
  tableDesMatières: [
    {
      profondeur: 2,
      texte: '💡 Un mail clé-en-main à adresser à votre communauté !',
      id: '-un-mail-cl-en-main-adresser-votre-communaut-',
    },
    {
      profondeur: 4,
      texte: 'Objet : Cybersécurité : passez à l&#39;action !',
      id: 'objet-cybers-curit-passez-l-39-action-',
    },
    {
      profondeur: 2,
      texte: '💡 Des posts pour vos réseaux sociaux',
      id: '-des-posts-pour-vos-r-seaux-sociaux',
    },
    {
      profondeur: 3,
      texte: 'LinkedIn',
      id: 'linkedin',
    },
    {
      profondeur: 3,
      texte: 'Facebook',
      id: 'facebook',
    },
    {
      profondeur: 3,
      texte: 'X/Twitter',
      id: 'x-twitter',
    },
    {
      profondeur: 2,
      texte: '📕 Une plaquette A5 à imprimer',
      id: '-une-plaquette-a5-imprimer',
    },
    {
      profondeur: 2,
      texte: '🔊 Une présentation clé-en-main sur les risques cyber et les moyens de s&#39;en prémunir',
      id: '-une-pr-sentation-cl-en-main-sur-les-risques-cyber-et-les-moyens-de-s-39-en-pr-munir',
    },
    {
      profondeur: 2,
      texte: '✉️ Une campagne de prévention par mail à adresser à votre communauté',
      id: '-une-campagne-de-pr-vention-par-mail-adresser-votre-communaut-',
    },

    {
      profondeur: 2,
      texte: '✏️ Un article sur la cybermenace pour votre site ?',
      id: '-un-article-sur-la-cybermenace-pour-votre-site-',
    },
    {
      profondeur: 2,
      texte: '🖍️ Des articles sur des tests cyber ludiques',
      id: '-des-articles-sur-des-tests-cyber-ludiques',
    },
  ],
};
