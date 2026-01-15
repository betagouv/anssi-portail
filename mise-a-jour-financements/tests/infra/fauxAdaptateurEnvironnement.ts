import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement';

export const fauxAdaptateurEnvironnement: AdaptateurEnvironnement = {
  grist: () => ({
    urlFinancements: () =>
      'http://grist/api/docs/idDeMonDocument/tables/idDeMaTable/records',
    cleApiFinancements: () => 'FAUSSE_CLE_API',
  }),
  aidesEntreprises: () => ({
    urlAPI: () => 'http://example.com/financements',
    apiId: () => 'mon-api-id',
    apiKey: () => 'mon-api-key',
  }),
};
