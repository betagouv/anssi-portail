import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ClientHttp } from '../../src/infra/clientHttp';
import {
  EntrepotGuideGrist,
  GuideGrist,
  RetourGuideGrist,
} from '../../src/infra/entrepotGuideGrist';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets';
import { ConstructeurGuideGrist } from '../api/guides/constructeurGuideGrist';

describe("L'entrepot de guide Grist", () => {
  function prepareEntrepotGristAvecEnregistrements(records: GuideGrist[]) {
    const clientHttp: ClientHttp<RetourGuideGrist> = {
      get: async () => ({ data: { records } }),
    };

    return new EntrepotGuideGrist({
      clientHttp,
      adaptateurEnvironnement: fauxAdaptateurEnvironnement,
    });
  }

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

  it("sait transformer le retour de l'API Grist en guides", async () => {
    const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
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
    ]);

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
        documents: [],
      },
      {
        id: 'guide2',
        nom: 'Deuxième guide',
        resume: 'Résumé du deuxième guide',
        description: '<p>Description du deuxième guide</p>',
        nomImage: 'vignette-2',
        langue: 'FR',
        collections: ['Les essentiels'],
        documents: [],
      },
    ]);
  });

  it("sait gérer l'absence d'image dans un guide", async () => {
    const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist().avecLImage(null).construis(),
    ]);

    const guides = await entrepotGuideGrist.tous();

    assert.equal(guides[0].nomImage, null);
  });

  it('sait récupérer un guide avec son id', async () => {
    const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist().avecLIdentifiant('guide1').construis(),
    ]);

    const guide1 = await entrepotGuideGrist.parId('guide1');

    assert.equal(guide1!.id, 'guide1');
  });

  it('sait récupérer les documents', async () => {
    const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist()
        .avecLIdentifiant('guide1')
        .avecLeDocument('Le guide', 'guide.pdf')
        .avecLeDocument('Le guide obsolète', 'guide-obsolete.pdf')
        .construis(),
    ]);

    const guide1 = await entrepotGuideGrist.parId('guide1');

    assert.deepEqual(guide1!.documents, [
      { libelle: 'Le guide', nomFichier: 'guide.pdf' },
      { libelle: 'Le guide obsolète', nomFichier: 'guide-obsolete.pdf' },
    ]);
  });
});
