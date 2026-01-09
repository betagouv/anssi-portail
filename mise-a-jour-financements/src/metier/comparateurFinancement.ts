import { AdaptateurSourceExterne } from '../infra/adaptateurSourceExterne.js';
import { EntrepotFinancement } from '../infra/entrepotFinancement.js';
import { Financement } from './financement.js';

export type DifferenceFinancement = {
  idFinancement: Financement['id'];
  donneesDifferentes: {
    nomDeLaDonnee: keyof Omit<Financement, 'id'>;
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

  compareSourceExterne() {
    return this.financements.reduce((accumulateur, financement) => {
      const financementSource = this.financementsSourceExterne.find(
        (f) => f.id === financement.id
      );
      if (!financementSource) {
        return accumulateur;
      }

      const differences = (
        ['objectifs', 'operationsEligibles', 'montant'] satisfies (keyof Omit<
          Financement,
          'id'
        >)[]
      )
        .map((champAComparer) =>
          this.compareChampFinancement(
            financement,
            financementSource,
            champAComparer
          )
        )
        .filter((difference) => !!difference);
      return [...accumulateur, ...differences];
    }, [] as DifferenceFinancement[]);
  }

  private compareChampFinancement(
    financementGrist: Financement,
    financementSource: Financement,
    champAComparer: keyof Omit<Financement, 'id'>
  ): DifferenceFinancement | undefined {
    if (
      financementGrist[champAComparer] !== financementSource[champAComparer]
    ) {
      return {
        idFinancement: financementGrist.id,
        donneesDifferentes: {
          nomDeLaDonnee: champAComparer,
          nouvelleValeur: financementSource[champAComparer],
          valeurSurGrist: financementGrist[champAComparer],
        },
      };
    }
  }
}
