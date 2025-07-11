export type EtapeTest = {
  titre: string;
  question: string;
  propositions: string[];
  id: IdRubrique | 'infos-complementaires';
};

export type Question = {
  titre: string;
  question: string;
  propositions: string[];
  id: IdRubrique;
};

export type IdRubrique =
  | 'pilotage'
  | 'budget'
  | 'ressources-humaines'
  | 'adoption-solutions'
  | 'prise-en-compte-risque'
  | 'posture';

export type Rubrique = {
  id: IdRubrique;
  label: string;
  ancrageTexte: 'start' | 'end';
  alignementVertical: 'middle' | 'auto' | 'hanging';
  lettre: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
};

export const questions: Question[] = [
  {
    titre: 'Prise en compte du risque',
    id: 'prise-en-compte-risque',
    question:
      'Quelle est la prise de conscience des risques cyber au sein de votre organisation&nbsp;?',
    propositions: [
      'Les responsables sous-estiment le risque de cyberattaques pour leur organisation.',
      'Les responsables ont conscience de l’existence de risques cyber mais n’en mesurent pas l’ampleur.',
      'Un recensement des données et processus à protéger en priorité a été effectué.',
      "Une analyse de risque approfondie de l'organisation a été réalisée.",
      'La gestion des risques cyber est pleinement intégrée à la stratégie globale de gestion des risques.',
    ],
  },
  {
    titre: 'Posture à l’égard de la cyber',
    id: 'posture',
    question:
      'Quel est le niveau de priorité accordé à la cybersécurité&nbsp;?',
    propositions: [
      "Le renforcement de la cybersécurité de l'organisation n'est pas une priorité.",
      'Les responsables comprennent qu’il y a un enjeu mais le perçoivent comme avant tout technique.',
      'L’intérêt pour le renforcement de la cybersécurité est réel et les directions métiers sont sensibilisées.',
      'La cybersécurité est un sujet prioritaire évoqué en CODIR et tous les agents sensibilisés.',
      'L’organisation est un acteur clé de la cybersécurité de son écosystème ou de son secteur d’activité.',
    ],
  },
  {
    titre: 'Pilotage de la sécurité',
    id: 'pilotage',
    question:
      'Comment est pilotée la cybersécurité de votre organisation&nbsp;?',
    propositions: [
      'La cybersécurité ne fait pas l’objet d’actions spécifiques.',
      "Des actions ponctuelles peuvent être menées mais sans plan d'action cyber structuré.",
      'Une première liste d’actions prioritaires à mettre en œuvre a été établie.',
      "Un plan d'action complet et tenu à jour structure l’action cyber de l’organisation.",
      "Les objectifs cyber sont intégrés dans la stratégie globale de l'organisation.",
    ],
  },
  {
    titre: 'Ressources humaines',
    id: 'ressources-humaines',
    question: 'Quels sont les moyens humains alloués à la cybersécurité&nbsp;?',
    propositions: [
      "L'organisation ne dispose d'aucune ressource dédiée à la cybersécurité.",
      'L’organisation dispose d’une personne référente sur les enjeux cyber, en plus de ses missions habituelles.',
      'Une personne est, à temps plein, responsable des enjeux de cybersécurité.',
      'Une équipe épaule la personne responsable des enjeux de cybersécurité.',
      'Un(e) directeur(ice) cyber siège au CODIR.',
    ],
  },
  {
    titre: 'Budget',
    id: 'budget',
    question:
      'Quels sont les moyens budgétaires alloués à la cybersécurité&nbsp;?',
    propositions: [
      'Aucun.',
      'Des dépenses occasionnelles sur la cybersécurité sont autorisées.',
      'Une part du budget informatique est alloué à la cybersécurité.',
      'Une ligne budgétaire est dédiée à la cybersécurité.',
      "La ligne dédiée à la cybersécurité est égale > ou = à 10% du budget informatique de l'organisation.",
    ],
  },
  {
    titre: 'Adoption de solutions cyber',
    id: 'adoption-solutions',
    question:
      "Quels produits ou services cyber sont utilisés au sein de l'organisation&nbsp;?",
    propositions: [
      'Aucun.',
      'Un antivirus est a minima installé sur les postes informatiques.',
      "Une ou plusieurs solutions visant à renforcer la protection des systèmes d'information sont déployées.",
      'Un audit de sécurité approfondi a été réalisé et des solutions en matière de détection et de réponse à incidents ont été ajoutées.',
      "L'organisation dispose d'un panel complet de services et d'outils cyber intégrés et réalise des audits réguliers.",
    ],
  },
];

export type ReponsesResultatTest = Record<IdRubrique, number>;

export const etapesTestMaturite: EtapeTest[] = [
  ...questions,
  {
    titre: 'Informations complémentaires',
    question: 'Pour finir',
    propositions: [],
    id: 'infos-complementaires',
  },
];
