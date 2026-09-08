import { EntrepotFinancement } from '../../metier/entrepotFinancement.js';
import { EntrepotGuide } from '../../metier/entrepotGuide.js';

export class RésolveurDePage {
  constructor(
    private readonly entrepotGuide: EntrepotGuide,
    private readonly entrepôtFinancement: EntrepotFinancement
  ) {}

  async guide(routeDemandée: string) {
    const idGuide = routeDemandée.match(/\/guides\/(.*)/)?.[1];
    if (!idGuide) {
      return;
    }
    return (await this.entrepotGuide.tous()).find((g) => g.id === idGuide);
  }

  async financement(routeDemandée: string) {
    const slug = routeDemandée.match(/^\/financements\/([^/?]+)(?:\?.*)?$/)?.[1];
    if (slug) {
      return (await this.entrepôtFinancement.tous()).find((financement) => financement.slug === slug);
    }
  }
}
