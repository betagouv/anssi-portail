// eslint-disable-next-line max-classes-per-file

import { describe, it } from 'node:test';
import { BusEvenements, EvenementDuBus } from '../../src/bus/busEvenements';
import assert from 'node:assert';

class EvenementTestA implements EvenementDuBus {
  increment: number = 0;

  constructor(increment?: number) {
    this.increment = increment || 0;
  }
}

class EvenementTestB implements EvenementDuBus {}

describe("Le bus d'événements", () => {
  const creeBusEvenements = () => new BusEvenements();

  it("permet de s'abonner à un type d'événement", async () => {
    let compteur = 0;

    const bus = creeBusEvenements();
    bus.abonne(EvenementTestA, async () => {
      compteur += 1;
    });

    await bus.publie(new EvenementTestA());

    assert.equal(compteur, 1);
  });

  it("permet d'ajouter plusieurs abonnés en un seul appel", async () => {
    let compteur = 0;

    const bus = creeBusEvenements();
    bus.abonnePlusieurs(EvenementTestA, [
      async () => {
        compteur += 1;
      },
      async () => {
        compteur += 10;
      },
    ]);

    await bus.publie(new EvenementTestA());

    assert.equal(compteur, 11);
  });

  it('fait la différence entre les événements', async () => {
    let compteur = 0;

    const bus = creeBusEvenements();
    bus.abonne(EvenementTestA, async () => {
      compteur += 1;
    });
    bus.abonne(EvenementTestB, async () => {
      compteur += 100;
    });

    await bus.publie(new EvenementTestA());

    assert.equal(compteur, 1);
  });

  it("appelle tous les abonnés du type d'événement publié", async () => {
    let compteur = 0;

    const bus = creeBusEvenements();
    bus.abonne(EvenementTestA, async () => {
      compteur += 1;
    });
    bus.abonne(EvenementTestA, async () => {
      compteur += 10;
    });

    await bus.publie(new EvenementTestA());

    assert.equal(compteur, 11);
  });

  it("passe l'événement reçu en paramètre aux abonnés", async () => {
    let compteur = 0;

    const bus = creeBusEvenements();
    bus.abonne(EvenementTestA, async (e: EvenementTestA) => {
      compteur += e.increment;
    });

    await bus.publie(new EvenementTestA(30));

    assert.equal(compteur, 30);
  });

  it("éxecute tous les handlers même en cas d'exception", async () => {
    let compteur = 0;

    const bus = creeBusEvenements();
    bus.abonne(EvenementTestA, async () => {
      throw new Error('BOUM');
    });
    bus.abonne(EvenementTestA, async () => {
      compteur += 1;
    });

    await bus.publie(new EvenementTestA());

    assert.equal(compteur, 1);
  });

  it("reste robuste si aucun handler n'existe pour l'événement", async () => {
    const bus = creeBusEvenements();

    // On veut juste vérifier que cette ligne ne jette aucune exception
    await bus.publie(new EvenementTestA());
  });
});
