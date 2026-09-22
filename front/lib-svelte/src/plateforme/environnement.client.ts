export const estServeur = false;
export const afficheParcoursSecurisation =
  import.meta.env.FEATURE_FLAG_PARCOURS_SECURISATION === 'true' ||
  import.meta.env.VITE_FEATURE_FLAG_PARCOURS_SECURISATION === 'true';

export const afficheBadgeCyberdépart = import.meta.env.FEATURE_FLAG_BADGE_CYBERDEPART === 'true';
