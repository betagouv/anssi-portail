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
  priseEnCompteRisque: string;
  posture: string;
  pilotage: string;
  ressourcesHumaines: string;
  budget: string;
  adoptionSolutions: string;
  niveauSecurite: string;
};

export const niveauxMaturite: NiveauMaturite[] = [
  {
    id: "insuffisant",
    label: "Insuffisant",
    description:
      "Une conscience insuffisante des risques cyber pesant sur l'organisation. Pas ou peu de mesures spécifiques mises en oeuvre en matière de cybersécurité.",
    priorite:
      "Prendre la mesure des risques cyber pour l'organisation et des impacts qu'entraîneraient une cyberattaque.",
    priseEnCompteRisque:
      "Les responsables de l'organisation pensent peu probable que celle-ci soit victime d'une cyberattaque.",
    posture:
      "Le renforcement de la cybersécurité de l'organisation n'est pas une priorité.",
    pilotage:
      "La cybersécurité n'est pas ou très peu prise en compte dans la gestion des systèmes d'information de l'organisation.",
    ressourcesHumaines:
      "L'organisation ne dispose d'aucune ressource dédiée à la cybersécurité.",
    budget: "Aucune dépense spécifique à la cybersécurité n'a été effectuée.",
    adoptionSolutions:
      "L'organisation ne dispose pas de solution dédiée à la cybersécurité ou, tout ou plus, d'un antivirus installé sur les postes informatiques.",
    niveauSecurite:
      "L'entité est vulnérable aux menaces cyber les plus courantes.",
  },
  {
    id: "emergent",
    label: "Émergent",
    description:
      "Une prise de conscience de l'existence de risques cyber pour l'organisation et une volonté de mettre en place des premières mesures cyber pertinentes.",
    priorite:
      "Identifier les mesures de cybersécurité prioritaires et rapides à mettre en oeuvre pour corriger les principales vulnérabilités.",
    priseEnCompteRisque:
      "Les responsables ont conscience que leur organisation peut être victime d'une cyberattaque, comme d'autres avant elle, sans savoir lesquelles ni les conséquences qu’elles entraîneraient.",
    posture:
      "Les responsables de l'organisation permettent au(x) responsable(s) informatique(s) d'agir tout en percevant le sujet comme avant tout technique.",
    pilotage:
      "Des actions en matière de cybersécurité sont parfois mises en œuvre mais sans réelle priorisation et sans plan d'action structuré.",
    ressourcesHumaines:
      "Une personne commence à assurer un suivi des enjeux cyber de l'organisation, en plus de ses missions courantes.",
    budget:
      "Des dépenses dédiées à la cybersécurité peuvent être occasionnellement autorisées.",
    adoptionSolutions:
      "Des premiers outils permettant de mieux protéger l'organisation peuvent être, d'opportunité, déployés.",
    niveauSecurite:
      "L'entité est vulnérable aux menaces cyber les plus courantes.",
  },
  {
    id: "intermediaire",
    label: "Intermédiaire",
    description:
      "Une conscience partagée des risques cyber pour l'organisation et la volonté de formaliser un plan d'action cyber complet tout en ajustant les moyens en conséquence.",
    priorite:
      "Structurer le plan d'action cyber et dédier une ligne budgétaire à la cybersécurité. ",
    priseEnCompteRisque:
      "Les données et les processus à protéger en priorité contre les risques d'origine cyber les plus courants ont été identifiés.",
    posture:
      "Les responsables perçoivent l'importance de la cybersécurité pour l'organisation et encouragent les équipes informatiques à agir.",
    pilotage:
      "Un premier plan d'action cyber avec des actions prioritaires à mettre en œuvre a été établi et fait l'objet d'un suivi.",
    ressourcesHumaines:
      "Une personne est dédiée à la cybersécurité l'organisation, comme un/e responsable de la sécurité des systèmes d'information (RSSI).",
    budget: "Une part du budget informatique est alloué à la cybersécurité.",
    adoptionSolutions:
      "L'organisation déploie de solutions sélectionnées en réponse aux actions prioritaires identifiées dans le plan d'action cyber.",
    niveauSecurite:
      "Des vulnérabilités importantes ont été corrigées mais l'organisation demeure vulnérable et n'est souvent pas préparée à faire face à une crise d'origine cyber.",
  },
  {
    id: "confirme",
    label: "Confirmé",
    description:
      "Une cartographie précise de ses risques cyber pour l'organisation, un plan d'action cyber approfondi et des moyens humains et budgétaires dédiés.",
    priorite:
      "Élargir la prise en compte des enjeux de cybersécurité notamment en matière de défense et de résilience et renforcer les moyens dédiés à la cybersécurité.",
    priseEnCompteRisque:
      "Une analyse de risque approfondie a été conduite à l'échelle de l'organisation et un plan détaillé de traitement des risques a été établi.",
    posture:
      "Les responsables encouragent l'ensemble de l'organisation à s'approprier les enjeux de cybersécurité.",
    pilotage:
      "Un plan d'action cyber complet est établi, régulièrement mis à jour et fait l'objet d'un suivi régulier au niveau des responsables de l'organisation.",
    ressourcesHumaines:
      "Le/la RSSI dispose d'une équipe dédiée aux enjeux de cybersécurité.",
    budget:
      "Une ligne budgétaire dédiée à la cybersécurité est établie à l'échelle de l'organisation.",
    adoptionSolutions:
      "Un audit de sécurité approfondi a été réalisé et l'organisation élargit les produits et services dont elle dispose à la défense et de résilience de l'organisation (ex. SOCs).",
    niveauSecurite:
      "L'organisation a mis en oeuvre des mesures efficaces contre les risques cyber les plus courants et dispose d'un niveau de préparation satisfaisant face à une crise d'origine cyber, mais demeure vulnérable à des attaques plus élaborées.",
  },
  {
    id: "optimal",
    label: "Optimal",
    description:
      "Des objectifs de réduction des risques cyber intégrés à la stratégie de l'organisation. Des moyens humains, budgétaires conséquents, un plan d'action cyber exhaustif, adapté aux menaces stratégiques. ",
    priorite:
      "Maintenir l'effort et faire, autant que possible, rayonner l'expertise cyber de l'organisation au profit d'entités moins matures et de son secteur.",
    priseEnCompteRisque:
      "Les objectifs de réduction des risques d'origine cyber font partie intégrante de la stratégie de gestion des risques de l'organisation et l'analyse de risque est régulièrement mise à jour.",
    posture:
      "La cybersécurité est un enjeu prioritaire de l'organisation traité en réunion de direction et pour lequel des objectifs sont fixés et suivis.",
    pilotage:
      "Un plan d'action cyber complet et pluriannuel a été établi avec des objectifs chiffrés, intégrés dans la stratégie globale de l'organisation.",
    ressourcesHumaines:
      "Une équipe cyber élargie ou plusieurs équipes cyber pilotent la cybersécurité de l'organisation dans ses différentes dimensions.",
    budget:
      "La ligne dédiée à la cybersécurité est égale > ou = à 10% du budget informatique de l'organisation.",
    adoptionSolutions:
      "L'organisation mobilise un panel complet de services et d'outils cyber intégrés répondant à l'ensemble des besoins de l'organisation en matière de cybersécurité et réalise des audits réguliers.",
    niveauSecurite:
      "L'organisation a mis en oeuvre des mesures lui permettant de se protéger contre des attaques élaborées et est parfaitement préparée à réagir à une crise d'origine cyber.",
  },
];
