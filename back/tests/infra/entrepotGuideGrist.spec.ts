import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  ClientHttp,
  EntrepotGuideGrist,
  RetourGuideGrist,
} from '../../src/infra/entrepotGuideGrist';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets';

describe("L'entrepot de guide Grist", () => {
  it('sait récupérer des guides en appelant Grist', async () => {
    let urlAppelee = '';
    let headerAuthent;
    const clientHttp: ClientHttp<RetourGuideGrist> = {
      get: async (url, config) => {
        urlAppelee = url;
        headerAuthent = config?.headers?.Authorization;
        return {
          data: { records: [] },
        };
      },
    };
    const entrepotGuideGrist = new EntrepotGuideGrist({
      clientHttp,
      adaptateurEnvironnement: fauxAdaptateurEnvironnement,
    });

    await entrepotGuideGrist.tous();

    assert.equal(headerAuthent, 'Bearer FAUSSE_CLE_API_GUIDES');
    assert.equal(
      urlAppelee,
      'http://grist/api/docs/idDocumentGuides/tables/idTableGuides/records'
    );
  });

  it("sait transfomer le retour de l'API Grist en guides", async () => {
    const guidesGrist: RetourGuideGrist = {
      records: [
        {
          id: 1,
          fields: {
            Identifiant: 'guide1',
          },
        },
        {
          id: 2,
          fields: {
            Identifiant: 'guide2',
          },
        },
      ],
    };
    const clientHttp: ClientHttp<RetourGuideGrist> = {
      get: async () => ({ data: guidesGrist }),
    };

    const entrepotGuideGrist = new EntrepotGuideGrist({
      clientHttp,
      adaptateurEnvironnement: fauxAdaptateurEnvironnement,
    });

    const guides = await entrepotGuideGrist.tous();

    assert.deepEqual(guides, [{ id: 'guide1' }, { id: 'guide2' }]);
  });
});
