export type AdaptateurEnvironnement = {
  grist: () => {
    urlFinancements: () => string;
    cleApiFinancements: () => string;
  };
};

export const adaptateurEnvironnement: AdaptateurEnvironnement = {
  grist: () => ({
    urlFinancements: () => process.env.FINANCEMENTS_GRIST_URL || '',
    cleApiFinancements: () => process.env.FINANCEMENTS_GRIST_API_KEY || '',
  }),
};
