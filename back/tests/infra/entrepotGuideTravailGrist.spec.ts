import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ClientHttp } from '../../src/infra/clientHttp';
import { GuideGrist } from '../../src/infra/entrepotGuideGrist';
import { EntrepotGuideTravailGrist } from '../../src/infra/entrepotGuideTravailGrist';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets';
import { ConstructeurGuideGrist } from '../api/guides/constructeurGuideGrist';
import { fabriqueClientGet, fabriqueClientPut, fabriqueFauxClientHttp } from './fournisseurClientHttp';

describe("L'entrepot de gestion de guide Grist", () => {
  function prepareEntrepotGristAvecEnregistrements(records: GuideGrist[]) {
    const donneesDansGrist = [...records];
    const clientHttp: ClientHttp = {
      ...fabriqueFauxClientHttp(),
      get: fabriqueClientGet(async () => ({ data: { records: donneesDansGrist } })),
      put: fabriqueClientPut(async (_url, corps) => {
        const data = corps as { records: { require: Record<string, string>; fields: Record<string, unknown> }[] };
        const idGuide = data.records[0].require['Identifiant'];
        const valeurs = data.records[0].fields as GuideGrist['fields'];
        const guide = donneesDansGrist.find((r) => r.fields.Identifiant === idGuide);
        if (!guide) return;
        guide.fields = { ...guide.fields, ...valeurs };
      }),
    };

    return new EntrepotGuideTravailGrist({
      clientHttp,
      adaptateurEnvironnement: fauxAdaptateurEnvironnement,
    });
  }

  it('sait récupérer un guide par son id', async () => {
    const entrepotGuideTravailGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist().avecLIdentifiant('guide1').avecLeTitre('Le guide 1').construis(),
    ]);

    const guide1 = await entrepotGuideTravailGrist.parId('guide1');

    assert.equal(guide1!.nom, 'Le guide 1');
  });

  it("sait transformer le retour de l'API Grist en guides", async () => {
    const entrepotGuideTravailGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist().avecLeNumeroDeLigne(1).avecLIdentifiant('guide1').construis(),
      new ConstructeurGuideGrist().avecLeNumeroDeLigne(2).avecLIdentifiant('guide2').construis(),
    ]);

    const guides = await entrepotGuideTravailGrist.tous();

    assert.equal(guides.length, 2);
    assert.equal(guides[0].id, 'guide1');
    assert.equal(guides[1].id, 'guide2');
  });

  describe('concernant les documents', () => {
    describe('sait ajouter un document à un guide', () => {
      it("lorsqu'il n'y a pas de documents existants", async () => {
        const entrepotGuideTravailGrist = prepareEntrepotGristAvecEnregistrements([
          new ConstructeurGuideGrist().avecLIdentifiant('guide1').construis(),
        ]);

        await entrepotGuideTravailGrist.sauvegardeDocuments(
          'guide1',
          [{ nomFichier: 'guide.pdf', libelle: 'Le guide' }],
          []
        );

        const guide1 = await entrepotGuideTravailGrist.parId('guide1');
        assert.deepEqual(guide1!.listeDocuments, [{ libelle: 'Le guide', nomFichier: 'guide.pdf' }]);
      });
    });

    it('sait persister les noms des anciens documents', async () => {
      const entrepotGuideTravailGrist = prepareEntrepotGristAvecEnregistrements([
        new ConstructeurGuideGrist().avecLIdentifiant('guide1').construis(),
      ]);

      await entrepotGuideTravailGrist.sauvegardeDocuments('guide1', [], ['ancien.pdf']);

      const guide1 = await entrepotGuideTravailGrist.parId('guide1');
      assert.deepEqual(guide1!.nomsAnciensDocuments, ['ancien.pdf']);
    });

    it('sait supprimer un document à un guide', async () => {
      const entrepotGuideTravailGrist = prepareEntrepotGristAvecEnregistrements([
        new ConstructeurGuideGrist().avecLIdentifiant('guide1').avecLeDocument('Le guide', 'guide.pdf').construis(),
      ]);

      await entrepotGuideTravailGrist.sauvegardeDocuments('guide1', [], []);

      const guide1 = await entrepotGuideTravailGrist.parId('guide1');
      assert.deepEqual(guide1!.listeDocuments, []);
    });
  });
});
