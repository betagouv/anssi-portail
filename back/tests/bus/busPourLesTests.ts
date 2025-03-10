import { BusEvenements, ClasseDEvenementDeBus, EvenementDuBus } from '../../src/bus/busEvenements';

export class MockBusEvenement extends BusEvenements {
  evenementsRecus: EvenementDuBus[] = [];

  async publie<T extends EvenementDuBus>(evenement: T) {
    this.evenementsRecus.push(evenement);
  }

  aRecuUnEvenement<T extends EvenementDuBus>(
    typeAttendu: ClasseDEvenementDeBus<T>
  ) {
    if (this.evenementsRecus.find((e) => e instanceof typeAttendu)) return true;

    throw new Error(
      `Événement attendu non reçu. Reçu : ${this.evenementsRecus
        .map((e: EvenementDuBus) => e.constructor.name)
        .join(' ')}`
    );
  }

  recupereEvenement<T extends EvenementDuBus>(
    typeAttendu: ClasseDEvenementDeBus<T>
  ) {
    return this.evenementsRecus.find(
      (e: EvenementDuBus) => e instanceof typeAttendu
    ) as T | undefined;
  }
}

export const fabriqueBusPourLesTests = () => {
  return new MockBusEvenement();
};
