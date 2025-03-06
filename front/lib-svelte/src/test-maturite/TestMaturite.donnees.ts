export type Question = {
  titre: string;
  question: string;
  propositions: string[];
  id: IdRubrique | "infos-complementaires";
};

export type IdRubrique =
  | "pilotage"
  | "budget"
  | "ressources-humaines"
  | "adoption-solutions"
  | "prise-en-compte-risque"
  | "posture";

export type Rubrique = {
  id: IdRubrique;
  label: string;
  ancrageTexte: "start" | "end";
  alignementVertical: "middle" | "auto" | "hanging";
  lettre: "A" | "B" | "C" | "D" | "E" | "F";
};

export const questions: Question[] = [
  {
    titre: "Prise en compte du risque",
    id: "prise-en-compte-risque",
    question:
      "Quelle est la perception des risques cyber au sein de votre organisation&nbsp;?",
    propositions: [
      "Les responsables considèrent que l'organisation n'est pas concernée par le risque de cyberattaques.",
      "Les responsables ont conscience que l’organisation pourrait être victime de cyberattaques sans mesurer l'ampleur du risque.",
      "Les données et les processus à protéger en priorité contre les risques cyber les plus courants ont été identifiés.",
      "Une analyse de risque approfondie de l'organisation a été menée et un plan détaillé de traitement des risques a été établi.",
      "Les objectifs de réduction des risques d'origine cyber sont intégrés dans la stratégie globale de gestion des risques de l'organisation.",
    ],
  },
  {
    titre: "Posture à l’égard de la cyber",
    id: "posture",
    question:
      "Quelle est la posture des responsables de votre organisation sur la cybersécurité&nbsp;?",
    propositions: [
      "Le renforcement de la cybersécurité de l'organisation n'est pas une priorité.",
      "Les responsables de l'organisation perçoivent le sujet comme avant tout technique.",
      "Les responsables manifestent un réel intérêt pour le renforcement de la cybersécurité et les directions métiers sont sensibilisées.",
      "La cybersécurité est un sujet prioritaire évoqué en CODIR, les directions métiers sont responsabilisées sur le sujet et les agents sensibilisés.",
      "L’organisation est un acteur clé de la cybersécurité au sein de son écosystème ou de son secteur d’activité.",
    ],
  },
  {
    titre: "Pilotage de la sécurité",
    id: "pilotage",
    question:
      "Comment est organisé le pilotage de la cybersécurité de votre organisation&nbsp;?",
    propositions: [
      "La cybersécurité n'est pas ou très peu prise en compte dans la gestion des systèmes d'information de l'organisation.",
      "Des actions en matière de cybersécurité sont parfois mises en oeuvre mais sans réelle priorisation et sans plan d'action structuré.",
      "Un premier plan d'action avec des actions prioritaires à mettre en oeuvre a été établi et est suivi.",
      "Un plan d'action cyber étoffé est établi et fait l’objet d’un suivi régulier.",
      "Un plan d'action cyber complet est établi et ses objectifs prioritaires sont intégrés dans la stratégie globale de l'organisation.",
    ],
  },
  {
    titre: "Ressources humaines",
    id: "ressources-humaines",
    question: "Quels sont les moyens humains alloués à la cybersécurité&nbsp;?",
    propositions: [
      "L'organisation ne dispose d'aucune ressource dédiée à la cybersécurité.",
      "Une personne est identifiée comme référente pour les enjeux cyber en plus de ses missions actuelles.",
      "La personne référente dispose d'un temps dédié au suivi des enjeux cyber et peut compter sur des soutiens ponctuels.",
      "Au moins un(e) responsable de la sécurité des systèmes d'information se dédie entièrement au sujet. Cette personne peut être épaulée d'une petite équipe.",
      "L’organisation dispose d'un(e) directeur(ice) cyber siégeant au CODIR et d'une ou plusieurs équipes cyber.",
    ],
  },
  {
    titre: "Budget",
    id: "budget",
    question:
      "Quels sont les moyens budgétaires alloués à la cybersécurité&nbsp;?",
    propositions: [
      "Aucune dépense spécifique à la cybersécurité n'a été effectuée.",
      "Des dépenses dédiées à la cybersécurité peuvent être occasionnellement autorisées.",
      "Une part du budget informatique est alloué à la cybersécurité.",
      "Une ligne budgétaire dédiée à la cybersécurité est établie à l'échelle de l'organisation.",
      "La ligne dédiée à la cybersécurité est égale > ou = à 10% du budget informatique de l'organisation.",
    ],
  },
  {
    titre: "Adoption de solutions cyber",
    id: "adoption-solutions",
    question:
      "Quels produits ou services cyber sont mobilisés au service de la cybersécurité de l'organisation&nbsp;?",
    propositions: [
      "L'organisation dispose tout au plus d'un antivirus, installé sur les postes informatiques des agents.",
      "Une ou plusieurs solutions cyber ont pu être déployées en fonction des opportunités.",
      "L’organisation dispose de plusieurs solutions adaptées aux actions prioritaires identifiées dans le plan d’action.",
      "Un audit de sécurité approfondi a été réalisé et l'organisation commence à disposer de produits et de services en matière de cyberdéfense.",
      "L'organisation dispose d'un panel complet de services et d'outils cyber intégrés et réalise des audits réguliers.",
    ],
  },
  {
    titre: "Informations complémentaires",
    question: "Pour finir",
    propositions: [],
    id: "infos-complementaires",
  },
];

export const secteurs = [
  { code: "A", libelle: "Agriculture, sylviculture et pêche" },
  { code: "B", libelle: "Industries extractives" },
  { code: "C", libelle: "Industrie manufacturière" },
  {
    code: "D",
    libelle:
      "Production et distribution d'électricité, de gaz, de vapeur et d'air conditionné",
  },
  {
    code: "E",
    libelle:
      "Production et distribution d'eau ; assainissement, gestion des déchets et dépollution",
  },
  { code: "F", libelle: "Construction" },
  {
    code: "G",
    libelle: "Commerce ; réparation d'automobiles et de motocycles",
  },
  { code: "H", libelle: "Transports et entreposage" },
  { code: "I", libelle: "Hébergement et restauration" },
  { code: "J", libelle: "Information et communication" },
  { code: "K", libelle: "Activités financières et d'assurance" },
  { code: "L", libelle: "Activités immobilières" },
  {
    code: "M",
    libelle: "Activités spécialisées, scientifiques et techniques",
  },
  {
    code: "N",
    libelle: "Activités de services administratifs et de soutien",
  },
  { code: "O", libelle: "Administration publique" },
  { code: "P", libelle: "Enseignement" },
  { code: "Q", libelle: "Santé humaine et action sociale" },
  { code: "R", libelle: "Arts, spectacles et activités récréatives" },
  { code: "S", libelle: "Autres activités de services" },
  {
    code: "T",
    libelle:
      "Activités des ménages en tant qu'employeurs ; activités indifférenciées des ménages en tant que producteurs de biens et services pour usage propre",
  },
  { code: "U", libelle: "Activités extra-territoriales" },
];
