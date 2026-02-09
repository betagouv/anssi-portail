import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Cache } from '../../src/infra/cache';
// import { add } from 'date-fns';
import { FournisseurHorloge } from '../../src/infra/fournisseurHorloge';

import { FournisseurHorlogeDeTest } from './fournisseurHorlogeDeTest';

const _24_HEURES = 1440;

const add = (date: Date, duration: { hours: number }) => {
  return new Date(date.getTime() + duration.hours * 3600000);
};

const ilSePasse25Heures = (): void => {
  FournisseurHorlogeDeTest.initialise(
    add(FournisseurHorloge.maintenant(), { hours: 25 })
  );
};

describe('Le système de mise en cache', () => {
  it('exécute la fonction passée lorsqu’il n’y a pas de cache', async () => {
    let ressourceAppelee = false;
    const cache = new Cache();

    await cache.get('une-clef', async () => {
      ressourceAppelee = true;
    });

    assert.equal(ressourceAppelee, true);
  });

  it('n’exécute pas la fonction passée lorsqu’il y a du cache', async () => {
    let ressourceAppelee = false;
    const cache = new Cache();

    await cache.get('une-clef', async () => {});
    await cache.get('une-clef', async () => {
      ressourceAppelee = true;
    });

    assert.equal(ressourceAppelee, false);
  });

  it('retourne le résultat de la fonction exécutée', async () => {
    const cache = new Cache<string>();
    const laFonction = async () => {
      return 'une valeur';
    };

    const resultat = await cache.get('une-clef', laFonction);

    assert.equal(resultat, 'une valeur');
  });

  it('retourne la valeur mise en cache', async () => {
    const cache = new Cache<string>();
    let compteur = 0;
    const laFonction = async () => {
      return `une valeur_${compteur++}`;
    };

    await cache.get('une-clef', laFonction);
    const resultat = await cache.get('une-clef', laFonction);

    assert.equal(resultat, 'une valeur_0');
  });

  it('effectue une mise en cache limitée dans le temps', async () => {
    FournisseurHorlogeDeTest.initialise(new Date(Date.parse('2025/01/01')));
    const cache = new Cache<string>({ ttl: _24_HEURES });
    let compteur = 0;
    const laFonction = async () => {
      return `une valeur_${compteur++}`;
    };

    await cache.get('une-clef', laFonction);
    ilSePasse25Heures();
    const resultat = await cache.get('une-clef', laFonction);

    assert.equal(resultat, 'une valeur_1');
  });

  it('la nouvelle valeur après expiration est mise en cache', async () => {
    FournisseurHorlogeDeTest.initialise(new Date(Date.parse('2025/01/01')));
    const cache = new Cache<string>({ ttl: _24_HEURES });
    let compteur = 0;
    const laFonction = async () => {
      return `une valeur_${compteur++}`;
    };

    await cache.get('une-clef', laFonction);
    ilSePasse25Heures();
    await cache.get('une-clef', laFonction);
    const resultat = await cache.get('une-clef', laFonction);

    assert.equal(resultat, 'une valeur_1');
  });

  describe('en cas d’erreur d’exécution de la fonction', () => {
    it('retourne le cache en cas d’erreur sur un appel suivant', async () => {
      FournisseurHorlogeDeTest.initialise(new Date(Date.parse('2025/01/01')));
      const cache = new Cache<string>({ ttl: 1440 });
      let compteur = 0;
      const laFonction = async () => {
        return `une valeur_${compteur++}`;
      };

      await cache.get('une-clef', laFonction);
      ilSePasse25Heures();
      const resultat = await cache.get('une-clef', () => {
        throw new Error('Erreur mais c’est mis en cache');
      });

      assert.equal(resultat, 'une valeur_0');
    });

    it('remonte l’erreur lors du premier appel', () => {
      const cache = new Cache<string>({ ttl: 1440 });
      const laFonction = async () => {
        throw new Error('Une erreur est survenue');
      };

      assert.rejects(cache.get('une-clef', laFonction), {
        message: 'Une erreur est survenue',
      });
    });
  });
});
