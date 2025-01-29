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
