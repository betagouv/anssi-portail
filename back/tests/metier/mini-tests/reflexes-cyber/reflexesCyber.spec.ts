import { beforeEach, describe, expect, it } from 'vitest';
import { RéflexesCyber } from '@metier/mini-tests/reflexes-cyber/reflexesCyber.js';
import { fauxRapporteur } from '../../../api/fauxObjets.js';
import { jeanneDupont } from '../../../api/objetsPretsALEmploi.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { EntrepôtRésultatTestRéflexesCyberMémoire } from '../../../persistance/entrepotResultatTestReflexesCyberMemoire.js';

describe('La simulation Réflexes Cyber', () => {
  let entrepôtRésultatTestRéflexesCyber: EntrepôtRésultatTestRéflexesCyberMémoire;
  let busÉvénements: MockBusEvenement;
  const simulation = new RéflexesCyber();

  beforeEach(() => {
    entrepôtRésultatTestRéflexesCyber = new EntrepôtRésultatTestRéflexesCyberMémoire();
    busÉvénements = fabriqueBusPourLesTests(fauxRapporteur);
  });

  const consommeLaRéponse = (numéroÉvènement: number, utilisateur?: typeof jeanneDupont) =>
    simulation.consommeLaRéponse({
      entrepôtRésultatTestRéflexesCyber,
      busÉvénements,
      idCorrélation: '01a0a561-2416-726f-84c5-7912f3dfb57e',
      idScénario: 'entreprise',
      idRôle: 'direction',
      numéroÉvènement,
      réflexe: 'bon',
      utilisateur,
      score: '5/6',
    });

  describe('lors de la dernière réponse', () => {
    it('entrepose le résultat avec le score pour un utilisateur connu', async () => {
      await consommeLaRéponse(6, jeanneDupont);

      expect(await entrepôtRésultatTestRéflexesCyber.taille()).toBe(1);
      const résultat = (await entrepôtRésultatTestRéflexesCyber.tous())[0];
      expect(résultat.score).toBe('5/6');
      expect(résultat.utilisateur.email).toBe(jeanneDupont.email);
      expect(résultat.dateRealisation).toBeInstanceOf(Date);
    });

    it('n’entrepose pas de résultat pour un utilisateur anonyme', async () => {
      await consommeLaRéponse(6);

      expect(await entrepôtRésultatTestRéflexesCyber.taille()).toBe(0);
    });
  });

  it('n’entrepose pas de résultat avant la dernière réponse', async () => {
    await consommeLaRéponse(5, jeanneDupont);

    expect(await entrepôtRésultatTestRéflexesCyber.taille()).toBe(0);
  });
});
