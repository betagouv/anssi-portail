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
          .avecLeResume('Résumé du premier guide')
          .avecLaDescription('<p>Description du premier guide</p>')
          .avecLImage('vignette-1')
          .avecLaLangue('FR')
          .avecLesCollections(['Les essentiels'])
          .construis(),
        new ConstructeurGuideGrist()
          .avecLeNumeroDeLigne(2)
          .avecLIdentifiant('guide2')
          .avecLeTitre('Deuxième guide')
          .avecLeResume('Résumé du deuxième guide')
          .avecLaDescription('<p>Description du deuxième guide</p>')
          .avecLImage('vignette-2')
          .avecLaLangue('FR')
          .avecLesCollections(['Les essentiels'])
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
        nom: 'Premier guide',
        resume: 'Résumé du premier guide',
        description: '<p>Description du premier guide</p>',
        nomImage: 'vignette-1',
        langue: 'FR',
        collections: ['Les essentiels'],
      },
      {
        id: 'guide2',
        nom: 'Deuxième guide',
        resume: 'Résumé du deuxième guide',
        description: '<p>Description du deuxième guide</p>',
        nomImage: 'vignette-2',
        langue: 'FR',
        collections: ['Les essentiels'],
      },
    ]);
  });
});
