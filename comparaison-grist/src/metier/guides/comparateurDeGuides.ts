import { EntrepotGuide } from './entrepotGuide';
import { ComparaisonDeGuides, Guide } from './guide.type';

export class ComparateurDeGuides {
  guidesSource: Guide[] = [];
  guidesCible: Guide[] = [];

  constructor(
    private readonly entrepotSource: EntrepotGuide,
    private readonly entrepotCible: EntrepotGuide
  ) {}

  async chargeLesDonnees() {
    const [donneesSource, donneesCible] = await Promise.all([
      this.entrepotSource.tous(),
      this.entrepotCible.tous(),
    ]).catch((error) => {
      console.error('Erreur lors de la récupération des données :', error);
      return [[], []];
    });

    this.guidesSource = donneesSource;
    this.guidesCible = donneesCible;
  }

  compare(): ComparaisonDeGuides {
    const ajouts = this.guidesSource.filter(
      (guideSource) =>
        !this.guidesCible.some((guideCible) => guideCible.id === guideSource.id)
    );

    const suppressions = this.guidesCible.filter(
      (guideCible) =>
        !this.guidesSource.some(
          (guideSource) => guideCible.id === guideSource.id
        )
    );
    const modifications = this.recupereLesGuidesModifies();
    return {
      ajouts,
      suppressions,
      modifications,
    };
  }

  private recupereLesGuidesModifies() {
    return this.guidesSource.reduce(
      (liste, guideSource) => {
        const guideCibleCorrespondant = this.guidesCible.find(
          (guideCible) => guideCible.id === guideSource.id
        );
        if (!guideCibleCorrespondant) {
          return liste;
        }
        const methodesExtractionValeursAComparer: Array<
          (guide: Guide) => string
        > = [
          (guide) => guide.nom,
          (guide) => guide.description,
          (guide) => guide.nomImage ?? '',
          (guide) => guide.langue,
          (guide) => guide.collections.toString(),
          (guide) => JSON.stringify(guide.documents),
          (guide) => guide.dateMiseAJour,
          (guide) => guide.datePublication,
          (guide) => guide.thematique,
          (guide) => guide.besoins.toString(),
        ];
        if (
          methodesExtractionValeursAComparer.some(
            (value) => value(guideSource) !== value(guideCibleCorrespondant)
          )
        ) {
          liste.push({ source: guideSource, cible: guideCibleCorrespondant });
        }
        return liste;
      },
      [] as ComparaisonDeGuides['modifications']
    );
  }
}
