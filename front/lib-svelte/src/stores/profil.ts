export type ProfilNavigation = {
  prenom: string;
  nom: string;
  estAgentAnssi: boolean;
  codeRegion: string | undefined;
  codeActivite: string | undefined;
  parcoursSecurisation: {
    parcoursActuel: 'complet' | 'allégé' | null | undefined;
  };
};

export type Profil = ProfilNavigation & {
  email: string;
  siret: string;
  idListeFavoris: string;
  codeDepartement: string | undefined;
  peutGererLesGuides: boolean;
};
