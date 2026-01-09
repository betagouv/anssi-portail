import { AdaptateurSourceExterne } from '../infra/adaptateurSourceExterne.js';
import { EntrepotFinancement } from '../infra/entrepotFinancement.js';
import { Financement } from './financement.js';

export type DifferenceFinancement = {
  idFinancement: Financement['id'];
  donneesDifferentes: {
    nomDeLaDonnee: keyof Financement;
    valeurSurGrist: string;
    nouvelleValeur: string;
  };
};

export class ComparateurFinancement {
  financements: Financement[];
  private financementsSourceExterne: Financement[];
  constructor(
    private readonly entrepotFinancement: EntrepotFinancement,
    private readonly adaptateurSourceExterne: AdaptateurSourceExterne
  ) {
    this.financements = [];
    this.financementsSourceExterne = [];
  }

  async chargeFinancements() {
    this.financements = await this.entrepotFinancement.tous();
    this.financementsSourceExterne = await Promise.all(
      this.financements.map((f) => this.adaptateurSourceExterne.parId(f.id))
    );
  }

  async compareSourceExterne() {
    return this.financements.reduce(async (accumulateur, financement) => {
      const financementSource = this.financementsSourceExterne.find(
        (f) => f.id === financement.id
      );
      if (!financementSource) {
        return accumulateur;
      }

      if (financement.objectifs !== financementSource.objectifs) {
        (await accumulateur).push({
          idFinancement: financement.id,
          donneesDifferentes: {
            nomDeLaDonnee: 'objectifs',
            nouvelleValeur: financementSource.objectifs,
            valeurSurGrist: financement.objectifs,
          },
        });
      }
      if (financement.montant !== financementSource.montant) {
        (await accumulateur).push({
          idFinancement: financement.id,
          donneesDifferentes: {
            nomDeLaDonnee: 'montant',
            nouvelleValeur: financementSource.montant,
            valeurSurGrist: financement.montant,
          },
        });
      }
      return accumulateur;
    }, Promise.resolve([] as DifferenceFinancement[]));
  }
}
