import { AdaptateurSourceExterne } from '../infra/adaptateurSourceExterne';
import { EntrepotFinancement } from '../infra/entrepotFinancement';
import { Financement } from './financement';

export type DifferenceFinancement = {
  idFinancement: Financement['id'];
  donneesDifferentes?: {
    nomDeLaDonnee: keyof Omit<Financement, 'id'>;
    valeurSurGrist: string;
    nouvelleValeur: string;
  };
  etat?: 'supprimé';
};

export class ComparateurFinancement {
  financements: Financement[];
  private readonly financementsSourceExterne: Map<
    number,
    Financement | undefined
  >;
  constructor(
    private readonly entrepotFinancement: EntrepotFinancement,
    private readonly adaptateurSourceExterne: AdaptateurSourceExterne
  ) {
    this.financements = [];
    this.financementsSourceExterne = new Map();
  }

  async chargeFinancements() {
    this.financements = await this.entrepotFinancement.tous();
    for (const f of this.financements) {
      const source = await this.adaptateurSourceExterne.parId(f.id);
      this.financementsSourceExterne.set(f.id, source);
    }
  }

  compareSourceExterne() {
    return this.financements.reduce((accumulateur, financement) => {
      const financementSource = this.financementsSourceExterne.get(
        financement.id
      );
      if (!financementSource) {
        return accumulateur.concat([
          { idFinancement: financement.id, etat: 'supprimé' },
        ]);
      }

      if (
        financementSource.derniereModification &&
        financement.derniereModification &&
        financementSource.derniereModification.getTime() <=
          financement.derniereModification.getTime()
      ) {
        return accumulateur;
      }
      const differences = (
        [
          'nom',
          'financeur',
          'objectifs',
          'operationsEligibles',
          'benificiaires',
          'montant',
          'condition',
        ] satisfies (keyof Omit<Financement, 'id' | 'derniereModification'>)[]
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
    champAComparer: keyof Omit<Financement, 'id' | 'derniereModification'>
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
