import { beforeEach, describe, expect, it } from 'vitest';
import {
  EntrepotGuideGrist,
  GuideGrist,
} from '../../../src/infrastructure/entrepotGuideGrist';
import { ClientHttp } from '../../../src/metier/clientHttp';
import { ComparateurDeGuides } from '../../../src/metier/guides/comparateurDeGuides';
import { ConstructeurGuideGrist } from './constructeurGuideGrist';

describe('Le comparateur de guides', () => {
  let clientHttpSource: ClientHttp;
  let clientHttpCible: ClientHttp;
  let comparateurDeGuides: ComparateurDeGuides;

  beforeEach(() => {
    clientHttpSource = {
      get: async <T>() => {
        return {
          data: {
            records: [],
          } as unknown as T,
        };
      },
    };
    clientHttpCible = {
      get: async <T>() => {
        return {
          data: {
            records: [],
          } as unknown as T,
        };
      },
    };
    comparateurDeGuides = new ComparateurDeGuides(
      new EntrepotGuideGrist(
        clientHttpSource,
        'http://localhost',
        'source',
        ''
      ),
      new EntrepotGuideGrist(clientHttpCible, 'http://localhost', 'cible', '')
    );
  });

  it('sait charger les données sources et cibles', async () => {
    const guide1 = new ConstructeurGuideGrist()
      .avecLeNumeroDeLigne(1)
      .avecLIdentifiant('guide1')
      .construis();
    const guide2 = new ConstructeurGuideGrist()
      .avecLeNumeroDeLigne(2)
      .avecLIdentifiant('guide2')
      .construis();

    clientHttpSource.get = async <T>() => {
      return {
        data: {
          records: [guide1],
        } as unknown as T,
      };
    };

    clientHttpCible.get = async <T>() => {
      return {
        data: {
          records: [guide2],
        } as unknown as T,
      };
    };

    await comparateurDeGuides.chargeLesDonnees();

    expect(comparateurDeGuides.guidesSource).toHaveLength(1);
    expect(comparateurDeGuides.guidesSource[0].id).toEqual(
      guide1.fields.Identifiant
    );
    expect(comparateurDeGuides.guidesCible).toHaveLength(1);
    expect(comparateurDeGuides.guidesCible[0].id).toEqual(
      guide2.fields.Identifiant
    );
  });

  describe('lors de la comparaison des guides', () => {
    it('sait retourner les guides à créer dans la cible', async () => {
      const guide1 = new ConstructeurGuideGrist()
        .avecLeNumeroDeLigne(1)
        .avecLIdentifiant('guide1')
        .construis();
      clientHttpSource.get = async <T>() => {
        return {
          data: {
            records: [guide1],
          } as unknown as T,
        };
      };
      await comparateurDeGuides.chargeLesDonnees();

      const comparaison = comparateurDeGuides.compare();

      expect(comparaison.ajouts).toHaveLength(1);
    });

    it('sait retourner les guides à supprimer dans la cible', async () => {
      const guide1 = new ConstructeurGuideGrist()
        .avecLeNumeroDeLigne(1)
        .avecLIdentifiant('guide1')
        .construis();
      clientHttpCible.get = async <T>() => {
        return {
          data: {
            records: [guide1],
          } as unknown as T,
        };
      };
      await comparateurDeGuides.chargeLesDonnees();

      const comparaison = comparateurDeGuides.compare();

      expect(comparaison.suppressions).toHaveLength(1);
    });

    describe('sait retourner les guides modifiés', () => {
      let coquilleDeGuide: ConstructeurGuideGrist;
      let guideOriginal: GuideGrist;
      beforeEach(() => {
        coquilleDeGuide = new ConstructeurGuideGrist()
          .avecLeNumeroDeLigne(1)
          .avecLIdentifiant('guide1')
          .avecLeTitre('Titre')
          .avecLaDescription('Description')
          .avecLImage('Image 1')
          .avecLaLangue('FR')
          .avecLesCollections(['REAGIR', 'SENSIBILISER'])
          .avecLeDocument('document 1', 'nom_du_document_1.pdf')
          .avecLaDateDeMiseAJour('13 Mars 2025')
          .avecLaDateDePublication('13 Mars 2025')
          .avecThematique('Thématique')
          .avecBesoin('ancien besoin');
        guideOriginal = coquilleDeGuide.construis();
      });

      const prepareLesDonnees = (
        guideOriginal: GuideGrist,
        guideCible: GuideGrist
      ) => {
        clientHttpSource.get = async <T>() => {
          return {
            data: {
              records: [guideOriginal],
            } as unknown as T,
          };
        };
        clientHttpCible.get = async <T>() => {
          return {
            data: {
              records: [guideCible],
            } as unknown as T,
          };
        };
        return comparateurDeGuides.chargeLesDonnees();
      };

      it('lorsque le titre a changé', async () => {
        const guideCible = coquilleDeGuide
          .avecLeTitre('Nouveau titre')
          .construis();
        await prepareLesDonnees(guideOriginal, guideCible);

        const comparaison = comparateurDeGuides.compare();

        expect(comparaison.modifications).toHaveLength(1);
      });

      it('lorsque la description a changé', async () => {
        const guideCible = coquilleDeGuide
          .avecLaDescription('Nouvelle description')
          .construis();
        await prepareLesDonnees(guideOriginal, guideCible);

        const comparaison = comparateurDeGuides.compare();

        expect(comparaison.modifications).toHaveLength(1);
      });

      it("lorsque le nom de l'image a changé", async () => {
        const guideCible = coquilleDeGuide.avecLImage('Image 2').construis();
        await prepareLesDonnees(guideOriginal, guideCible);

        const comparaison = comparateurDeGuides.compare();

        expect(comparaison.modifications).toHaveLength(1);
      });

      it('lorsque la langue a changé', async () => {
        const guideCible = coquilleDeGuide.avecLaLangue('EN').construis();
        await prepareLesDonnees(guideOriginal, guideCible);

        const comparaison = comparateurDeGuides.compare();

        expect(comparaison.modifications).toHaveLength(1);
      });

      it('lorsque les collections ont changé', async () => {
        const guideCible = coquilleDeGuide
          .avecLesCollections(['REAGIR', 'SE FORMER'])
          .construis();
        await prepareLesDonnees(guideOriginal, guideCible);

        const comparaison = comparateurDeGuides.compare();

        expect(comparaison.modifications).toHaveLength(1);
      });

      it('lorsque les documents ont changé', async () => {
        const guideCible = coquilleDeGuide
          .avecLeDocument('document 2', 'nom_du_document_2.pdf')
          .construis();
        await prepareLesDonnees(guideOriginal, guideCible);

        const comparaison = comparateurDeGuides.compare();

        expect(comparaison.modifications).toHaveLength(1);
      });

      it('lorsque la date de mise à jour a changé', async () => {
        const guideCible = coquilleDeGuide
          .avecLaDateDeMiseAJour('20 Juin 2025')
          .construis();
        await prepareLesDonnees(guideOriginal, guideCible);

        const comparaison = comparateurDeGuides.compare();

        expect(comparaison.modifications).toHaveLength(1);
      });

      it('lorsque la date de publication a changé', async () => {
        const guideCible = coquilleDeGuide
          .avecLaDateDePublication('20 Juin 2025')
          .construis();
        await prepareLesDonnees(guideOriginal, guideCible);

        const comparaison = comparateurDeGuides.compare();

        expect(comparaison.modifications).toHaveLength(1);
      });

      it('lorsque la thématique a changé', async () => {
        const guideCible = coquilleDeGuide
          .avecThematique('Nouvelle thématique')
          .construis();
        await prepareLesDonnees(guideOriginal, guideCible);

        const comparaison = comparateurDeGuides.compare();

        expect(comparaison.modifications).toHaveLength(1);
      });

      it('lorsque les besoins ont changé', async () => {
        const guideCible = coquilleDeGuide
          .avecBesoin('nouveau besoin')
          .construis();
        await prepareLesDonnees(guideOriginal, guideCible);

        const comparaison = comparateurDeGuides.compare();

        expect(comparaison.modifications).toHaveLength(1);
      });
    });
  });
});
