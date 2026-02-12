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
    ]);

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
    return {
      ajouts,
      suppressions,
    };
  }
}
