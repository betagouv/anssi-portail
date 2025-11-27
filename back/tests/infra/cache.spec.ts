import { describe, it } from 'node:test';
import assert from 'node:assert';

import { FournisseurHorlogeDeTest } from './fournisseurHorlogeDeTest';
import { Cache } from '../../src/infra/cache';
// import { add } from 'date-fns';
import { FournisseurHorloge } from '../../src/infra/fournisseurHorloge';

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
  it('exécute la fonction passée lorsqu’il n’y a pas de cache', () => {
    let ressourceAppelee = false;
    const cache = new Cache();

    cache.get('une-clef', () => {
      ressourceAppelee = true;
    });

    assert.equal(ressourceAppelee, true);
  });

  it('n’exécute pas la fonction passée lorsqu’il y a du cache', () => {
    let ressourceAppelee = false;
    const cache = new Cache();

    cache.get('une-clef', () => {});
    cache.get('une-clef', () => {
      ressourceAppelee = true;
    });

    assert.equal(ressourceAppelee, false);
  });

  it('retourne le résultat de la fonction exécutée', () => {
    const cache = new Cache<string>();
    const laFonction = () => {
      return 'une valeur';
    };

    const resultat = cache.get('une-clef', laFonction);

    assert.equal(resultat, 'une valeur');
  });

  it('retourne la valeur mise en cache', () => {
    const cache = new Cache<string>();
    let compteur = 0;
    const laFonction = () => {
      return `une valeur_${compteur++}`;
    };

    cache.get('une-clef', laFonction);
    const resultat = cache.get('une-clef', laFonction);

    assert.equal(resultat, 'une valeur_0');
  });

  it('effectue une mise en cache limitée dans le temps', () => {
    FournisseurHorlogeDeTest.initialise(new Date(Date.parse('2025/01/01')));
    const cache = new Cache<string>({ ttl: _24_HEURES });
    let compteur = 0;
    const laFonction = () => {
      return `une valeur_${compteur++}`;
    };

    cache.get('une-clef', laFonction);
    ilSePasse25Heures();
    const resultat = cache.get('une-clef', laFonction);

    assert.equal(resultat, 'une valeur_1');
  });

  it('la nouvelle valeur après expiration est mise en cache', () => {
    FournisseurHorlogeDeTest.initialise(new Date(Date.parse('2025/01/01')));
    const cache = new Cache<string>({ ttl: _24_HEURES });
    let compteur = 0;
    const laFonction = () => {
      return `une valeur_${compteur++}`;
    };

    cache.get('une-clef', laFonction);
    ilSePasse25Heures();
    cache.get('une-clef', laFonction);
    const resultat = cache.get('une-clef', laFonction);

    assert.equal(resultat, 'une valeur_1');
  });

  describe('en cas d’erreur d’exécution de la fonction', () => {
    it('retourne le cache en cas d’erreur sur un appel suivant', () => {
      FournisseurHorlogeDeTest.initialise(new Date(Date.parse('2025/01/01')));
      const cache = new Cache<string>({ ttl: 1440 });
      let compteur = 0;
      const laFonction = () => {
        return `une valeur_${compteur++}`;
      };

      cache.get('une-clef', laFonction);
      ilSePasse25Heures();
      const resultat = cache.get('une-clef', () => {
        throw new Error('Erreur mais c’est mis en cache');
      });

      assert.equal(resultat, 'une valeur_0');
    });

    it('remonte l’erreur lors du premier appel', () => {
      const cache = new Cache<string>({ ttl: 1440 });
      const laFonction = () => {
        throw new Error('Une erreur est survenue');
      };

      assert.throws(() => cache.get('une-clef', laFonction), {
        message: 'Une erreur est survenue',
      });
    });
  });
});
