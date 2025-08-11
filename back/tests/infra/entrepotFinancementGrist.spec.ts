import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  ClientHttp,
  EntrepotFinancementGrist,
} from '../../src/infra/entrepotFinancementGrist';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets';

describe("L'entrepot de financement Grist", () => {
  const clientHttp: ClientHttp = {
    get: async () => {},
  };
  const entrepotFinancementGrist = new EntrepotFinancementGrist({
    clientHttp,
    adaptateurEnvironnement: fauxAdaptateurEnvironnement,
  });

  it('sait récupérer des financements en appelant Grist', async () => {
    let urlAppelee = '';
    let headerAuthent;

    clientHttp.get = async (url, config) => {
      urlAppelee = url;
      headerAuthent = config?.headers?.Authorization;
      return {
        data: [],
      };
    };

    await entrepotFinancementGrist.tous();

    assert.equal(headerAuthent, 'Bearer FAUSSE_CLE_API');
    assert.equal(
      urlAppelee,
      'http://grist/api/docs/idDeMonDocument/tables/idDeMaTable/records'
    );
  });
});
