import { EntrepotGuide } from './entrepotGuide';
import { Guide } from './guide.type';

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
}
