import { afterEach, describe, expect, it, vi } from 'vitest';

import { ClientHttp } from '@infra/clientHttp.js';
import { GuideGrist } from '@infra/entrepotGuideGrist.js';
import { EntrepotGuideTravailGrist } from '@infra/entrepotGuideTravailGrist.js';

import { fauxAdaptateurEnvironnement } from '../api/fauxObjets.js';
import { ConstructeurGuideGrist } from '../api/guides/constructeurGuideGrist.js';
import { fabriqueClientGet, fabriqueClientPut, fabriqueFauxClientHttp } from './fournisseurClientHttp.js';

describe("L'entrepot de gestion de guide Grist", () => {
  afterEach(() => vi.useRealTimers());

  it.each([
    [1.234567, '1970-01-01T00:00:01.234Z'],
    [null, '2026-01-01T12:00:00Z'],
    [0, '2026-01-01T12:00:00Z'],
  ])('convertit la date Grist %s en instant', async (secondes, dateAttendue) => {
    vi.useFakeTimers({ toFake: ['Temporal'] });
    vi.setSystemTime(Temporal.Instant.from('2026-01-01T12:00:00Z'));
    const enregistrement = new ConstructeurGuideGrist().avecLIdentifiant('guide1').construis();
    enregistrement.fields.Date_de_mise_a_jour_s_ = secondes;
    const entrepôt = prepareEntrepotGristAvecEnregistrements([enregistrement]);

    const guide = await entrepôt.parId('guide1');

    expect(guide?.dateMiseAJour.toString()).toBe(dateAttendue);
  });

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

    expect(guide1!.nom).toBe('Le guide 1');
  });

  it("sait transformer le retour de l'API Grist en guides", async () => {
    const entrepotGuideTravailGrist = prepareEntrepotGristAvecEnregistrements([
      new ConstructeurGuideGrist().avecLeNumeroDeLigne(1).avecLIdentifiant('guide1').construis(),
      new ConstructeurGuideGrist().avecLeNumeroDeLigne(2).avecLIdentifiant('guide2').construis(),
    ]);

    const guides = await entrepotGuideTravailGrist.tous();

    expect(guides).toHaveLength(2);
    expect(guides[0].id).toBe('guide1');
    expect(guides[1].id).toBe('guide2');
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
        expect(guide1!.listeDocuments).toEqual([{ libelle: 'Le guide', nomFichier: 'guide.pdf' }]);
      });
    });

    it('sait persister les noms des anciens documents', async () => {
      const entrepotGuideTravailGrist = prepareEntrepotGristAvecEnregistrements([
        new ConstructeurGuideGrist().avecLIdentifiant('guide1').construis(),
      ]);

      await entrepotGuideTravailGrist.sauvegardeDocuments('guide1', [], ['ancien.pdf']);

      const guide1 = await entrepotGuideTravailGrist.parId('guide1');
      expect(guide1!.nomsAnciensDocuments).toEqual(['ancien.pdf']);
    });

    it('sait supprimer un document à un guide', async () => {
      const entrepotGuideTravailGrist = prepareEntrepotGristAvecEnregistrements([
        new ConstructeurGuideGrist().avecLIdentifiant('guide1').avecLeDocument('Le guide', 'guide.pdf').construis(),
      ]);

      await entrepotGuideTravailGrist.sauvegardeDocuments('guide1', [], []);

      const guide1 = await entrepotGuideTravailGrist.parId('guide1');
      expect(guide1!.listeDocuments).toEqual([]);
    });
  });
});
