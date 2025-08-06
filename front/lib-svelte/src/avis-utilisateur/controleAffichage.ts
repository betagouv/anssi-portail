const UNE_JOURNEE_EN_MILLISECONDE = 1000 * 60 * 60 * 24;

export const proposeAvisUtilisteur = ({
  dateDernierAvis,
  dateDerniereFermeture,
}: {
  dateDernierAvis?: Date;
  dateDerniereFermeture?: Date;
}): boolean => {
  if (dateDernierAvis) {
    return false;
  }
  if (
    dateDerniereFermeture &&
    dateDerniereFermeture.getTime() >=
      new Date().getTime() - UNE_JOURNEE_EN_MILLISECONDE
  ) {
    return false;
  }
  return true;
};

export const afficheAvisUtilisateur = ({
  cheminCourant,
}: {
  cheminCourant: string;
}): boolean => {
  return !RegExp(/(\/?)(cyberdepart|test-maturite)(\/?)$/).exec(cheminCourant);
};

export const calculeDelaiRestantAvisUtilisateur = ({
  dureeMinimumEnSecondes,
  datePremiereVisite,
}: {
  dureeMinimumEnSecondes: number;
  datePremiereVisite?: Date;
}) => {
  if (!datePremiereVisite) {
    return dureeMinimumEnSecondes;
  }
  return (
    dureeMinimumEnSecondes -
    (new Date().getTime() - datePremiereVisite.getTime()) / 1000
  );
};
