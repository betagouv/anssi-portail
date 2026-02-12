export type AdaptateurEnvironnement = {
  grist: () => {
    urlGuideSource: () => string;
    urlGuideCible: () => string;
    cleApiSource: () => string;
    cleApiCible: () => string;
  };
};

export const adaptateurEnvironnement: AdaptateurEnvironnement = {
  grist: () => ({
    urlGuideSource: () => process.env.GUIDES_SOURCE_GRIST_URL || '',
    urlGuideCible: () => process.env.GUIDES_CIBLE_GRIST_URL || '',
    cleApiSource: () => process.env.GUIDES_SOURCE_GRIST_API_KEY || '',
    cleApiCible: () => process.env.GUIDES_CIBLE_GRIST_API_KEY || '',
  }),
};
