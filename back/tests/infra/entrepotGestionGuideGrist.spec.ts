import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ClientHttp } from '../../src/infra/clientHttp';
import { EntrepotGestionGuideGrist } from '../../src/infra/entrepotGestionGuideGrist';
import { GuideGrist } from '../../src/infra/entrepotGuideGrist';
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

    return new EntrepotGestionGuideGrist({
      clientHttp,
      adaptateurEnvironnement: fauxAdaptateurEnvironnement,
    });
  }

  it('sait récupérer un guide par son id', async () => {
    const entrepotGestionGuideGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist().avecLIdentifiant('guide1').avecLeTitre('Le guide 1').construis(),
    ]);

    const guide1 = await entrepotGestionGuideGrist.parId('guide1');

    assert.equal(guide1!.nom, 'Le guide 1');
  });

  describe('concernant les documents', () => {
    describe('sait ajouter un document à un guide', () => {
      it("lorsqu'il n'y a pas de documents existants", async () => {
        const entrepotGestionGuideGrist = prepareEntrepotGristAvecEnregistrements([
          new ConstructeurGuideGrist().avecLIdentifiant('guide1').construis(),
        ]);

        await entrepotGestionGuideGrist.ajouteDocument('guide1', 'guide.pdf', 'Le guide');

        const guide1 = await entrepotGestionGuideGrist.parId('guide1');
        assert.deepEqual(guide1!.listeDocuments, [{ libelle: 'Le guide', nomFichier: 'guide.pdf' }]);
      });
    });
  });
});
