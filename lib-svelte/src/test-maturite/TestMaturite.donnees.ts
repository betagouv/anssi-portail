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

export type IdNiveau =
  | "insuffisant"
  | "emergent"
  | "intermediaire"
  | "confirme"
  | "optimal";

export type NiveauMaturite = {
  id: IdNiveau;
  label: string;
  description: string;
  priorite: string;
};

export const niveauxMaturite: NiveauMaturite[] = [
  {
    id: "insuffisant",
    label: "Insuffisant",
    description:
      "Une conscience insuffisante des risques cyber pesant sur l'organisation. Pas ou peu de mesures spécifiques mises en oeuvre en matière de cybersécurité.",
    priorite:
      "Prendre la mesure des risques cyber pour l'organisation et des impacts qu'entraîneraient une cyberattaque.",
  },
  {
    id: "emergent",
    label: "Émergent",
    description:
      "Une prise de conscience de l'existence de risques cyber pour l'organisation et une volonté de mettre en place des premières mesures cyber pertinentes.",
    priorite:
      "Identifier les mesures de cybersécurité prioritaires et rapides à mettre en oeuvre pour corriger les principales vulnérabilités.",
  },
  {
    id: "intermediaire",
    label: "Intermédiaire",
    description:
      "Une conscience partagée des risques cyber pour l'organisation et la volonté de formaliser un plan d'action cyber complet tout en ajustant les moyens en conséquence.",
    priorite:
      "Structurer le plan d'action cyber et dédier une ligne budgétaire à la cybersécurité. ",
  },
  {
    id: "confirme",
    label: "Confirmé",
    description:
      "Une cartographie précise de ses risques cyber pour l'organisation, un plan d'action cyber approfondi et des moyens humains et budgétaires dédiés.",
    priorite:
      "Élargir la prise en compte des enjeux de cybersécurité notamment en matière de défense et de résilience et renforcer les moyens dédiés à la cybersécurité.",
  },
  {
    id: "optimal",
    label: "Optimal",
    description:
      "Des objectifs de réduction des risques cyber intégrés à la stratégie de l'organisation. Des moyens humains, budgétaires conséquents, un plan d'action cyber exhaustif, adapté aux menaces stratégiques. ",
    priorite:
      "Maintenir l'effort et faire, autant que possible, rayonner l'expertise cyber de l'organisation au profit d'entités moins matures et de son secteur.",
  },
];

export const questions: Question[] = [
  {
    titre: "Prise en compte du risque",
    id: "prise-en-compte-risque",
    question:
      "Quelle est la perception des risques cyber au sein de votre organisation&nbsp;?",
    propositions: [
      "Les responsables considèrent que leur organisation n'est pas concernée par le risque de cyberattaques.",
      "Les responsables ont conscience que leur organisation peut être victime de cyberattaques, comme d'autres avant elle, sans savoir exactement lesquelles ni les conséquences qu’elles entraîneraient.",
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
      "Les responsables de l'organisation autorisent le/les responsables informatiques à agir mais perçoivent le sujet comme avant tout technique.",
      "Les responsables manifestent un réel intérêt pour le renforcement de la cybersécurité et les directions métiers sont sensibilisées.",
      "La cybersécurité est un sujet prioritaire évoqué en CODIR, les directions métiers sont responsabilisées sur le sujet et les agents sensibilisés.",
      "Les responsables souhaitent influer au-delà de leur organisation pour un renforcement de la cyber sécurité de leur écosystème voire de leur secteur d’activité.",
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
      "Un plan d'action cyber complet est établi, régulièrement mis à jour et fait l'objet d'un suivi régulier au niveau des responsables de l'organisation.",
      "Un plan d'action cyber complet et pluriannuel a été établi avec des objectifs chiffrés, intégrés dans la stratégie globale de l'organisation.",
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
      "L'organisation dispose d'un(e) directeur(ice) cyber siégeant au CODIR et d'une ou plusieurs équipes cyber pouvant inclure des compétences en matière de cyberdéfense.",
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
      "Certains achats des solutions cyber ont été réalisés sur les conseils du prestataire informatique de l'organisation, sans répondre nécessairement à un plan d'action cyber.",
      "L'organisation dispose de plusieurs outils adaptés aux actions prioritaires identifiées et permettant un premier niveau de supervision de la sécurité de l'organisation.",
      "Un audit de sécurité approfondi a été réalisé et l'organisation commence à disposer de produits et de services cyber en matière de défense et de résilience (SOCs, CERTs, etc.)",
      "L'organisation dispose d'un panel complet de services et d'outils cyber intégrés répondant à l'ensemble des besoins de l'organisation et réalise des audits réguliers.",
    ],
  },
  {
    titre: "Adoption de solutions cyber",
    question: "Informations complémentaires",
    propositions: [],
    id: "infos-complementaires",
  },
];
