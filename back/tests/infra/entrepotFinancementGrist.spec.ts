import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  ClientHttp,
  EntrepotFinancementGrist,
} from '../../src/infra/entrepotFinancementGrist';

describe("L'entrepot de financement Grist", () => {
  const clientHttp: ClientHttp = {
    get: async () => {},
  };
  const entrepotFinancementGrist = new EntrepotFinancementGrist({ clientHttp });

  it('sait récupérer des financements en appelant Grist', async () => {
    let urlAppelee = '';

    clientHttp.get = async (url) => {
      urlAppelee = url;
      return {
        data: [],
      };
    };

    await entrepotFinancementGrist.tous();

    assert.equal(urlAppelee, 'la vraie url');
  });
});
