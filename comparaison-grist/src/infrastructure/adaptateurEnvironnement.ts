export type AdaptateurEnvironnement = {
  grist: () => {
    source: () => {
      urlDoc: () => string;
      idTable: () => string;
      cleApi: () => string;
    };
    cible: () => {
      urlDoc: () => string;
      idTable: () => string;
      cleApi: () => string;
    };
  };
};

export const adaptateurEnvironnement: AdaptateurEnvironnement = {
  grist: () => ({
    source: () => ({
      urlDoc: () => process.env.GUIDES_SOURCE_GRIST_URL || '',
      idTable: () => process.env.GUIDES_SOURCE_GRIST_ID_TABLE || '',
      cleApi: () => process.env.GUIDES_SOURCE_GRIST_API_KEY || '',
    }),
    cible: () => ({
      urlDoc: () => process.env.GUIDES_CIBLE_GRIST_URL || '',
      idTable: () => process.env.GUIDES_CIBLE_GRIST_ID_TABLE || '',
      cleApi: () => process.env.GUIDES_CIBLE_GRIST_API_KEY || '',
    }),
  }),
};
