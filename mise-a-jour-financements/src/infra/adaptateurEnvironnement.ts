export type AdaptateurEnvironnement = {
  grist: () => {
    urlFinancements: () => string;
    cleApiFinancements: () => string;
  };

  aidesEntreprises: () => {
    url: () => string;
    apiId: () => string;
    apiKey: () => string;
  };
};

export const adaptateurEnvironnement: AdaptateurEnvironnement = {
  grist: () => ({
    urlFinancements: () => process.env.FINANCEMENTS_GRIST_URL || '',
    cleApiFinancements: () => process.env.FINANCEMENTS_GRIST_API_KEY || '',
  }),
  aidesEntreprises: () => ({
    url: () => process.env.AIDES_ENTREPRISES_API_URL || '',
    apiId: () => process.env.AIDES_ENTREPRISES_API_ID || '',
    apiKey: () => process.env.AIDES_ENTREPRISES_API_KEY || '',
  }),
};
