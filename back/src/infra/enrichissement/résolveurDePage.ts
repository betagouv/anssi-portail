import { EntrepotFinancement } from '../../metier/entrepotFinancement.js';
import { EntrepotGuide } from '../../metier/entrepotGuide.js';

export class RésolveurDePage {
  constructor(
    private entrepotGuide: EntrepotGuide,
    private entrepôtFinancement: EntrepotFinancement
  ) {}
  async guide(routeDemandée: string) {
    const idGuide = routeDemandée.match(/\/guides\/(.*)/)?.[1];
    if (!idGuide) return;
    return (await this.entrepotGuide.tous()).find((g) => g.id === idGuide);
  }
  async financement(routeDemandée: string) {
    const idFinancement = routeDemandée.match(/\/financements\/(.*)/)?.[1];
    if (idFinancement) return this.entrepôtFinancement.parId(Number(idFinancement));
  }
}
