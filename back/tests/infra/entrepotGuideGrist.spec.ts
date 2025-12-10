import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
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
          dureeCacheEnSecondes: () => 0,
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
        headerAuthent = config?.headers?.authorization;
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
        .avecLaDescription('<p>Description du premier guide</p>')
        .avecLImage('vignette-1')
        .avecLaLangue('FR')
        .avecLesCollections(['Les essentiels'])
        .construis(),
      new ConstructeurGuideGrist()
        .avecLeNumeroDeLigne(2)
        .avecLIdentifiant('guide2')
        .avecLeTitre('Deuxième guide')
        .avecLaDescription('<p>Description du deuxième guide</p>')
        .avecLImage('vignette-2')
        .avecLaLangue('FR')
        .avecLesCollections(['Les essentiels'])
        .construis(),
    ]);

    const guides = await entrepotGuideGrist.tous();

    assert.equal(guides.length, 2);

    const premierGuide = guides[0];
    assert.equal(premierGuide.id, 'guide1');
    assert.equal(premierGuide.nom, 'Premier guide');
    assert.equal(
      premierGuide.description,
      '<p>Description du premier guide</p>'
    );
    assert.equal(premierGuide.nomImage, 'vignette-1');
    assert.equal(premierGuide.langue, 'FR');
    assert.deepEqual(premierGuide.collections, ['Les essentiels']);
    assert.deepEqual(premierGuide.documents, []);

    const deuxiemeGuide = guides[1];
    assert.equal(deuxiemeGuide.id, 'guide2');
    assert.equal(deuxiemeGuide.nom, 'Deuxième guide');
    assert.equal(
      deuxiemeGuide.description,
      '<p>Description du deuxième guide</p>'
    );
    assert.equal(deuxiemeGuide.nomImage, 'vignette-2');
    assert.equal(deuxiemeGuide.langue, 'FR');
    assert.deepEqual(deuxiemeGuide.collections, ['Les essentiels']);
    assert.deepEqual(deuxiemeGuide.documents, []);
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

  describe('concernant les documents', () => {
    it('sait les récupérer', async () => {
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

    it('ignore les lignes vides', async () => {
      const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
        new ConstructeurGuideGrist()
          .avecLIdentifiant('guide1')
          .avecLaChaineDeDocument('Le guide : guide.pdf\n')
          .construis(),
      ]);

      const guide1 = await entrepotGuideGrist.parId('guide1');

      assert.deepEqual(guide1!.documents, [
        { libelle: 'Le guide', nomFichier: 'guide.pdf' },
      ]);
    });

    it('gère les libellés avec un caractère deux-points', async () => {
      const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
        new ConstructeurGuideGrist()
          .avecLIdentifiant('guide1')
          .avecLaChaineDeDocument(
            'Le guide : la base de la cybersécurité : guide_base_cybersecu.pdf\n'
          )
          .construis(),
      ]);

      const guide1 = await entrepotGuideGrist.parId('guide1');

      assert.deepEqual(guide1!.documents, [
        {
          libelle: 'Le guide : la base de la cybersécurité',
          nomFichier: 'guide_base_cybersecu.pdf',
        },
      ]);
    });
  });

  it('sait récupérer les dates', async () => {
    const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist()
        .avecLIdentifiant('guide1')
        .avecLaDateDeMiseAJour('12 Novembre 2024')
        .avecLaDateDePublication('09 Mars 2023')
        .construis(),
    ]);

    const guide1 = await entrepotGuideGrist.parId('guide1');

    assert.equal(guide1!.datePublication, '09 Mars 2023');
    assert.equal(guide1!.dateMiseAJour, '12 Novembre 2024');
  });

  it('sait récupérer les thématiques', async () => {
    const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist()
        .avecThematique('Internet des objets')
        .construis(),
    ]);

    const guides = await entrepotGuideGrist.tous();

    const guide = guides[0];
    assert.equal(guide.thematique, 'Internet des objets');
  });

  describe("lors d'une recherche par collection", () => {
    let entrepotGuideGrist: EntrepotGuideGrist;
    beforeEach(() => {
      entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
        new ConstructeurGuideGrist()
          .avecLIdentifiant('guide1')
          .avecLesCollections(['Les essentiels'])
          .construis(),
        new ConstructeurGuideGrist()
          .avecLIdentifiant('guide2')
          .avecLesCollections(['Les fondamentaux'])
          .construis(),
        new ConstructeurGuideGrist()
          .avecLIdentifiant('guide3')
          .avecLesCollections(['Les essentiels', 'Les fondamentaux'])
          .construis(),
      ]);
    });
    it('retourne une liste vide si les collections sont vides', async () => {
      const guides = await entrepotGuideGrist.parCollections([]);

      assert.equal(guides.length, 0);
    });

    it('sait retourner les guides correspondants à une collection', async () => {
      const guides = await entrepotGuideGrist.parCollections([
        'Les essentiels',
      ]);

      assert.equal(guides.length, 2);
      assert.equal(guides[0].id, 'guide1');
      assert.equal(guides[1].id, 'guide3');
    });

    it('sait retourner les guides correspondants à plusieurs collections', async () => {
      const guides = await entrepotGuideGrist.parCollections([
        'Les essentiels',
        'Les fondamentaux',
      ]);

      assert.equal(guides.length, 3);
      assert.equal(guides[0].id, 'guide1');
      assert.equal(guides[1].id, 'guide2');
      assert.equal(guides[2].id, 'guide3');
    });
  });

  it('sait récupérer les besoins', async () => {
    const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist()
        .avecBesoin('Réagir')
        .avecBesoin('Sensibiliser')
        .avecBesoin('Former')
        .avecBesoin('Sécuriser')
        .avecBesoin('Un besoin inconnu')
        .construis(),
    ]);

    const guides = await entrepotGuideGrist.tous();

    const guide = guides[0];
    assert.deepEqual(guide.besoins, [
      'REAGIR',
      'ETRE_SENSIBILISE',
      'SE_FORMER',
      'SECURISER',
    ]);
  });
});
