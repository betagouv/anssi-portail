import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ClientHttp } from '../../src/infra/clientHttp';
import {
  EntrepotGuideGrist,
  RetourGuideGrist,
} from '../../src/infra/entrepotGuideGrist';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets';
import { ConstructeurGuideGrist } from '../api/guides/constructeurGuideGrist';

describe("L'entrepot de guide Grist", () => {
  it("ne renvoie rien si l'url source n'est pas définie", async () => {
    const entrepotGuideGristHorsLigne = new EntrepotGuideGrist({
      clientHttp: {
        get: async () => {
          throw new Error('Ne devrait pas être appelé');
        },
      },
      adaptateurEnvironnement: {
        ...fauxAdaptateurEnvironnement,
        grist: () => ({
          cleApiFinancements: () => '',
          cleApiGuides: () => '',
          urlFinancements: () => '',
          urlGuides: () => '',
        }),
      },
    });

    const guides = await entrepotGuideGristHorsLigne.tous();

    assert.deepEqual(guides, []);
  });
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
        new ConstructeurGuideGrist()
          .avecLeNumeroDeLigne(1)
          .avecLIdentifiant('guide1')
          .avecLeTitre('Premier guide')
          .avecLImage('http://localhost:8080/vignette-1')
          .construis(),
        new ConstructeurGuideGrist()
          .avecLeNumeroDeLigne(2)
          .avecLIdentifiant('guide2')
          .avecLeTitre('Deuxième guide')
          .avecLImage('http://localhost:8080/vignette-2')
          .construis(),
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

    assert.deepEqual(guides, [
      {
        id: 'guide1',
        titre: 'Premier guide',
        lienVignette: 'http://localhost:8080/vignette-1',
      },
      {
        id: 'guide2',
        titre: 'Deuxième guide',
        lienVignette: 'http://localhost:8080/vignette-2',
      },
    ]);
  });
});
