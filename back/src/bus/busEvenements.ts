export type GestionnaireDEvenement<T extends EvenementDuBus> = (evenement: T) => Promise<void>

export interface EvenementDuBus {
}

export type ClasseDEvenementDeBus<T extends EvenementDuBus> = new (
  ...args: any[]
) => T;

export class BusEvenements {
  gestionnaires: Record<string, GestionnaireDEvenement<any>[]> = {};

  abonne<T extends EvenementDuBus>(classeEvenement: new() => T, gestionnaire: GestionnaireDEvenement<T>) {
    this.gestionnaires[classeEvenement.name] ??= [];
    this.gestionnaires[classeEvenement.name].push(gestionnaire);
  }

  abonnePlusieurs<T extends EvenementDuBus>(classeEvenement: new() => T, gestionnaires: GestionnaireDEvenement<T>[]) {
    gestionnaires.forEach((h) => this.abonne(classeEvenement, h));
  }

  async publie<T extends EvenementDuBus>(evenement: T) {
    // On fonctionne exprès en `fire & forget` pour les handlers.
    // Dans un souci de performance : on ne veut pas attendre les exécutions.
    this.gestionnaires[evenement.constructor.name]?.forEach((gestionnaire: GestionnaireDEvenement<T>) => {
      gestionnaire(evenement).catch((e: Error) => {
        console.error(`Erreur lors du traitement de l'évènement`, e.message);
      });
    });
  }
}

