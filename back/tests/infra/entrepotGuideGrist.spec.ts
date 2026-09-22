import { beforeEach, describe, expect, it } from 'vitest';
import { ClientHttp } from '../../src/infra/clientHttp.js';
import { EntrepotGuideGrist, GuideGrist } from '../../src/infra/entrepotGuideGrist.js';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets.js';
import { ConstructeurGuideGrist } from '../api/guides/constructeurGuideGrist.js';
import { fabriqueClientGet, fabriqueFauxClientHttp } from './fournisseurClientHttp.js';

describe("L'entrepot de guide Grist", () => {
  function prepareEntrepotGristAvecEnregistrements(records: GuideGrist[]) {
    const clientHttp: ClientHttp = {
      ...fabriqueFauxClientHttp(),
      get: fabriqueClientGet(async () => ({ data: { records } })),
    };

    return new EntrepotGuideGrist({
      clientHttp,
      adaptateurEnvironnement: fauxAdaptateurEnvironnement,
    });
  }

  it("ne renvoie rien si l'url source n'est pas définie", async () => {
    const entrepotGuideGristHorsLigne = new EntrepotGuideGrist({
      clientHttp: {
        ...fabriqueFauxClientHttp(),
      },
      adaptateurEnvironnement: {
        ...fauxAdaptateurEnvironnement,
        grist: () => ({
          ...fauxAdaptateurEnvironnement.grist(),
          guides: () => ({
            cleApi: () => '',
            urlTable: () => '',
          }),
        }),
      },
    });

    const guides = await entrepotGuideGristHorsLigne.tous();

    expect(guides).toEqual([]);
  });

  it('sait récupérer des guides en appelant Grist', async () => {
    let urlAppelee = '';
    let headerAuthent;
    const clientHttp: ClientHttp = {
      ...fabriqueFauxClientHttp(),
      get: fabriqueClientGet(async (url, config) => {
        urlAppelee = url;
        headerAuthent = config?.headers?.authorization;
        return {
          data: { records: [] },
        };
      }),
    };
    const entrepotGuideGrist = new EntrepotGuideGrist({
      clientHttp,
      adaptateurEnvironnement: fauxAdaptateurEnvironnement,
    });

    await entrepotGuideGrist.tous();

    expect(headerAuthent).toBe('Bearer FAUSSE_CLE_API_GUIDES');
    expect(urlAppelee).toBe(
      'http://grist/api/docs/idDocumentGuides/tables/idTableGuides/records?sort=-Date_de_mise_a_jour_s_'
    );
  });

  it("sait transformer le retour de l'API Grist en guides", async () => {
    const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist()
        .avecLeNumeroDeLigne(1)
        .avecLIdentifiant('guide1')
        .avecLeTitre('Premier guide')
        .avecLaDescription('<p>Description du premier guide</p>')
        .avecLaLangue('FR')
        .avecLesCollections(['Les essentiels'])
        .avecLeLienCourt('https://lien-court/guide')
        .avecLancienDocument('ancien-doc.pdf')
        .construis(),
      new ConstructeurGuideGrist()
        .avecLeNumeroDeLigne(2)
        .avecLIdentifiant('guide2')
        .avecLeTitre('Deuxième guide')
        .avecLaDescription('<p>Description du deuxième guide</p>')
        .avecLaLangue('FR')
        .avecLesCollections(['Les essentiels'])
        .construis(),
    ]);

    const guides = await entrepotGuideGrist.tous();

    expect(guides).toHaveLength(2);

    const premierGuide = guides[0];
    expect(premierGuide.id).toBe('guide1');
    expect(premierGuide.nom).toBe('Premier guide');
    expect(premierGuide.description).toBe('<p>Description du premier guide</p>');
    expect(premierGuide.langue).toBe('FR');
    expect(premierGuide.collections).toEqual(['Les essentiels']);
    expect(premierGuide.listeDocuments).toEqual([]);
    expect(premierGuide.nomsAnciensDocuments).toEqual(['ancien-doc.pdf']);
    expect(premierGuide.lienCourt).toBe('https://lien-court/guide');

    const deuxiemeGuide = guides[1];
    expect(deuxiemeGuide.id).toBe('guide2');
    expect(deuxiemeGuide.nom).toBe('Deuxième guide');
    expect(deuxiemeGuide.description).toBe('<p>Description du deuxième guide</p>');
    expect(deuxiemeGuide.langue).toBe('FR');
    expect(deuxiemeGuide.collections).toEqual(['Les essentiels']);
    expect(deuxiemeGuide.listeDocuments).toEqual([]);
  });

  it('sait récupérer un guide avec son id', async () => {
    const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist().avecLIdentifiant('guide1').construis(),
    ]);

    const guide1 = await entrepotGuideGrist.parId('guide1');

    expect(guide1!.id).toBe('guide1');
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

      expect(guide1!.listeDocuments).toEqual([
        { libelle: 'Le guide', nomFichier: 'guide.pdf' },
        { libelle: 'Le guide obsolète', nomFichier: 'guide-obsolete.pdf' },
      ]);
    });
  });

  it('sait récupérer les dates', async () => {
    const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist()
        .avecLIdentifiant('guide1')
        .avecLaDateDeMiseAJour(new Date(2024, 10, 12).getTime() / 1000)
        .construis(),
    ]);

    const guide1 = await entrepotGuideGrist.parId('guide1');

    expect(guide1!.dateMiseAJour.getTime()).toBe(new Date(2024, 10, 12).getTime());
  });

  it('sait récupérer les thématiques', async () => {
    const entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist().avecThematique('Internet des objets').construis(),
    ]);

    const guides = await entrepotGuideGrist.tous();

    const guide = guides[0];
    expect(guide.thematique).toBe('Internet des objets');
  });

  describe("lors d'une recherche par collection", () => {
    let entrepotGuideGrist: EntrepotGuideGrist;
    beforeEach(() => {
      entrepotGuideGrist = prepareEntrepotGristAvecEnregistrements([
        new ConstructeurGuideGrist().avecLIdentifiant('guide1').avecLesCollections(['Les essentiels']).construis(),
        new ConstructeurGuideGrist().avecLIdentifiant('guide2').avecLesCollections(['Les fondamentaux']).construis(),
        new ConstructeurGuideGrist()
          .avecLIdentifiant('guide3')
          .avecLesCollections(['Les essentiels', 'Les fondamentaux'])
          .construis(),
      ]);
    });
    it('retourne une liste vide si les collections sont vides', async () => {
      const guides = await entrepotGuideGrist.parCollections([]);

      expect(guides).toHaveLength(0);
    });

    it('sait retourner les guides correspondants à une collection', async () => {
      const guides = await entrepotGuideGrist.parCollections(['Les essentiels']);

      expect(guides).toHaveLength(2);
      expect(guides[0].id).toBe('guide1');
      expect(guides[1].id).toBe('guide3');
    });

    it('sait retourner les guides correspondants à plusieurs collections', async () => {
      const guides = await entrepotGuideGrist.parCollections(['Les essentiels', 'Les fondamentaux']);

      expect(guides).toHaveLength(3);
      expect(guides[0].id).toBe('guide1');
      expect(guides[1].id).toBe('guide2');
      expect(guides[2].id).toBe('guide3');
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
    expect(guide.besoins).toEqual(['REAGIR', 'ETRE_SENSIBILISE', 'SE_FORMER', 'SECURISER']);
  });
});
