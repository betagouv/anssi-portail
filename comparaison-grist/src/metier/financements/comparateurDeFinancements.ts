import { EntrepotFinancement } from './entrepotFinancement';
import { ComparaisonDeFinancements, Financement } from './financement.type';

export class ComparateurDeFinancements {
  financementsSource: Financement[] = [];
  financementsCible: Financement[] = [];

  constructor(
    private readonly entrepotSource: EntrepotFinancement,
    private readonly entrepotCible: EntrepotFinancement
  ) {}

  async chargeLesDonnees() {
    const [donneesSource, donneesCible] = await Promise.all([
      this.entrepotSource.tous(),
      this.entrepotCible.tous(),
    ]).catch((error) => {
      console.error('Erreur lors de la récupération des données :', error);
      return [[], []];
    });

    this.financementsSource = donneesSource;
    this.financementsCible = donneesCible;
  }

  compare(): ComparaisonDeFinancements {
    const ajouts = this.financementsSource.filter(
      (financementSource) =>
        !this.financementsCible.some((financementCible) => financementCible.id === financementSource.id)
    );

    const suppressions = this.financementsCible.filter(
      (financementCible) =>
        !this.financementsSource.some((financementSource) => financementCible.id === financementSource.id)
    );
    const modifications = this.recupereLesFinancementsModifies();
    return {
      ajouts,
      suppressions,
      modifications,
    };
  }

  private recupereLesFinancementsModifies() {
    return this.financementsSource.reduce(
      (liste, financementSource) => {
        const financementCibleCorrespondant = this.financementsCible.find(
          (financementCible) => financementCible.id === financementSource.id
        );
        if (!financementCibleCorrespondant) {
          return liste;
        }
        const methodesExtractionValeursAComparer: Array<(financement: Financement) => string> = [
          (financement) => financement.nom,
          (financement) => financement.benificiaires,
          (financement) => financement.condition,
          (financement) => financement.contact,
          (financement) => financement.entitesElligibles.toString(),
          (financement) => financement.financeur,
          (financement) => financement.montant,
          (financement) => financement.objectifs,
          (financement) => financement.operationsEligibles,
          (financement) => financement.perimetresGeographiques.toString(),
          (financement) => financement.regions.toString(),
          (financement) => financement.sources.toString(),
          (financement) => financement.typesDeFinancement.toString(),
        ];
        if (
          methodesExtractionValeursAComparer.some(
            (methodeDeComparaison) =>
              methodeDeComparaison(financementSource) !== methodeDeComparaison(financementCibleCorrespondant)
          )
        ) {
          liste.push({ source: financementSource, cible: financementCibleCorrespondant });
        }
        return liste;
      },
      [] as ComparaisonDeFinancements['modifications']
    );
  }
}
