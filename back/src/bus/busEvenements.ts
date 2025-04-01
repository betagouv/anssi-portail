export type GestionnaireDEvenement<T extends EvenementDuBus> = (
  evenement: T
) => Promise<void>;

export type EvenementDuBus = object;

export type ClasseDEvenementDeBus<T extends EvenementDuBus> = new (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => T;

export class BusEvenements {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gestionnaires: Record<string, GestionnaireDEvenement<any>[]> = {};

  abonne<T extends EvenementDuBus>(
    classeEvenement: ClasseDEvenementDeBus<T>,
    gestionnaire: GestionnaireDEvenement<T>
  ) {
    this.gestionnaires[classeEvenement.name] ??= [];
    this.gestionnaires[classeEvenement.name].push(gestionnaire);
  }

  abonnePlusieurs<T extends EvenementDuBus>(
    classeEvenement: ClasseDEvenementDeBus<T>,
    gestionnaires: GestionnaireDEvenement<T>[]
  ) {
    gestionnaires.forEach((h) => this.abonne(classeEvenement, h));
  }

  async publie<T extends EvenementDuBus>(evenement: T) {
    // On fonctionne exprès en `fire & forget` pour les handlers.
    // Dans un souci de performance : on ne veut pas attendre les exécutions.
    this.gestionnaires[evenement.constructor.name]?.forEach(
      (gestionnaire: GestionnaireDEvenement<T>) => {
        gestionnaire(evenement).catch((e: Error) => {
          console.error(`Erreur lors du traitement de l'évènement`, e.message);
        });
      }
    );
  }
}
