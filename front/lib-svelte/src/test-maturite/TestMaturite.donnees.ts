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

export const tranchesEffectifEtablissement = [
  { code: "00", libelle: "0 salarié" },
  { code: "01", libelle: "1 ou 2 salariés" },
  { code: "02", libelle: "3 à 5 salariés" },
  { code: "03", libelle: "6 à 9 salariés" },
  { code: "11", libelle: "10 à 19 salariés" },
  { code: "12", libelle: "20 à 49 salariés" },
  { code: "21", libelle: "50 à 99 salariés" },
  { code: "22", libelle: "100 à 199 salariés" },
  { code: "31", libelle: "200 à 499 salariés" },
  { code: "41", libelle: "500 à 999 salariés" },
  { code: "42", libelle: "1000 à 1999 salariés" },
  { code: "51", libelle: "2000 à 4999 salariés" },
  { code: "52", libelle: "5000 salariés ou plus" },
  { code: "53", libelle: "10 000 salariés et plus" },
];
