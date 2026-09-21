const cheminAssets = '/assets/images/mini-tests/reflexe-cyber';

export type IdScénario = 'collectivité' | 'entreprise';

export type Scénario = {
  id: IdScénario;
  titre: string;
  description: string;
  image: { src: string; alt: string };
  métrique: { label: string; bloquage: number[] };
};

export const scénarios: Scénario[] = [
  {
    id: 'collectivité',
    titre: 'Collectivité',
    description:
      "Vous êtes dans une commune de 10 000 habitants, 180 agents. Tensions politiques autour d'un projet onéreux, dette de 100 000 €, élections imminentes. Trois agents gèrent l'informatique. Un audit récent a révélé des failles — le plan d'action n'a pas encore été validé.",
    image: {
      src: `${cheminAssets}/scenario-collectivite.avif`,
      alt: 'Équipe municipale réunie dans une mairie',
    },
    métrique: { label: 'Démarches bloquées', bloquage: [46, 128, 310, 590, 870, 1140] },
  },
  {
    id: 'entreprise',
    titre: 'Entreprise',
    description:
      "Vous êtes responsables d'une PME de 50 collaborateurs, spécialisée dans la gestion d'une plateforme logistique pour des clients industriels et e-commerce (CA : 7 M€). La trésorerie est fragilisée par un investissement récent, et des employés mécontents de leurs conditions de travail menacent de faire grève. Le SI (site, PGI logistique, paie, fichiers) est hébergé sur des serveurs internes.",
    image: {
      src: `${cheminAssets}/scenario-entreprise.avif`,
      alt: 'Équipe réunie dans un entrepôt logistique',
    },
    métrique: { label: 'Commandes bloquées', bloquage: [12, 37, 86, 154, 236, 318] },
  },
];
