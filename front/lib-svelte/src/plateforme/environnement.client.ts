export const estServeur = false;
export const afficheParcoursSecurisation =
  import.meta.env.FEATURE_FLAG_PARCOURS_SECURISATION === 'true' ||
  import.meta.env.VITE_FEATURE_FLAG_PARCOURS_SECURISATION === 'true';
