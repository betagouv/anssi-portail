import {
  IdNiveauMaturite,
  IdRubrique,
  ResultatTestMaturite,
  tousLesIdRubrique,
} from './resultatTestMaturite';

type ScoresPourUnNiveau = {
  id: IdNiveauMaturite;
  valeurs: Record<IdRubrique, number[]>;
};

export type RepartitionResultatsTestPourUnNiveau = {
  id: IdNiveauMaturite;
  valeurs: Record<IdRubrique, number>;
  totalNombreTests: number | undefined;
};

export class RepartitionResultatsTest {
  constructor(private readonly resultatsDeTest: ResultatTestMaturite[]) {}

  calculeRepartitionParNiveau = () => {
    const listeDesScoresParNiveau = this.resultatsDeTest.reduce(
      (accumulateur, test) => {
        const niveau = test.niveau();
        let scoresParNiveauCourant = accumulateur.find(
          (scoreParNiveau) => scoreParNiveau.id === niveau
        );
        if (!scoresParNiveauCourant) {
          scoresParNiveauCourant = {
            id: niveau,
            valeurs: this.creeObjetParRubrique(() => []),
          };
          accumulateur.push(scoresParNiveauCourant);
        }
        tousLesIdRubrique.forEach((rubrique) => {
          scoresParNiveauCourant.valeurs[rubrique].push(
            test.reponses[rubrique]
          );
        });
        return accumulateur;
      },
      [] as ScoresPourUnNiveau[]
    );

    return listeDesScoresParNiveau.map((scoresParNiveau) => ({
      id: scoresParNiveau.id,
      valeurs: this.creeObjetParRubrique((rubrique) =>
        this.calculeValeurMoyenne(rubrique, scoresParNiveau)
      ),
      totalNombreTests: scoresParNiveau.valeurs['adoption-solutions'].length,
      ratio:
        scoresParNiveau.valeurs['adoption-solutions'].length /
        this.resultatsDeTest.length,
    }));
  };

  private calculeValeurMoyenne(
    idRubrique: IdRubrique,
    scoresParNiveau: ScoresPourUnNiveau
  ): number {
    return (
      scoresParNiveau.valeurs[idRubrique].reduce((accumulateur, valeur) => {
        return accumulateur + valeur;
      }, 0) / scoresParNiveau.valeurs[idRubrique].length
    );
  }

  private creeObjetParRubrique<T>(
    valeurDeLaRubrique: (rubrique: IdRubrique) => T
  ): Record<IdRubrique, T> {
    return tousLesIdRubrique.reduce(
      (rubriqueAccumulateur, rubrique) => {
        return {
          ...rubriqueAccumulateur,
          [rubrique]: valeurDeLaRubrique(rubrique),
        };
      },
      {} as Record<IdRubrique, T>
    );
  }
}
