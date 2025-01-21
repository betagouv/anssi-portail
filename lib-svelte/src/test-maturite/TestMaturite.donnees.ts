type Question = {
  titre: string;
  question: string;
  propositions: string[];
};

export const questions: Question[] = [
  {
    titre: "Prise en compte du risque",
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
    question: "Quels sont les moyens humains alloués à la cybersécurité&nbsp;?",
    propositions: [
      "L'organisation ne dispose d'aucune ressource dédiée à la cybersécurité.",
      "Une personne est identifiée comme référente pour les enjeux cyber en plus de ses missions actuelles.",
      "La personne référente dispose d'un temps dédié au suivi des enjeux cyber et peut compter sur des soutiens ponctuels.",
      "Au moins un(e) responsable de la sécurité des systèmes d'information se dédie entièrement au sujet. Cette personne peut être épaulée d'une petite équipe.",
      "L'organisation dispose d'un(e) directeur(ice) cyber siégeant au CODIR et d'une ou plusieurs équipes cyber pouvant inclure des compétences en matière de cyberdéfense.",
    ],
  },
];
