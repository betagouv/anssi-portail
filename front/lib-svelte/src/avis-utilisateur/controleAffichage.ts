const UNE_JOURNEE_EN_MILLISECONDE = 1000 * 60 * 60 * 24;

export const proposeAvisUtilisteur = ({
  cheminCourant,
  dateDernierAvis,
  dateDerniereFermeture,
}: {
  cheminCourant: string;
  dateDernierAvis?: Date;
  dateDerniereFermeture?: Date;
}): boolean => {
  if (RegExp(/(\/?)(cyberdepart|test-maturite)(\/?)$/).exec(cheminCourant)) {
    return false;
  }
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
