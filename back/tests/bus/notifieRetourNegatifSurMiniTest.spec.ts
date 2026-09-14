import { describe, it, expect } from 'vitest';
import { fausseMessagerieInstantanee } from '../api/fauxObjets.js';
import { notifieUnRetourNégatifSurMiniTest } from '../../src/bus/notifieRetourNegatifSurMiniTest.js';
import { RetourMiniTestDonné } from '../../src/bus/evenements/retourMiniTestDonne.js';
import { RetourNégatifSurMiniTest } from '../../src/metier/messagerieInstantanee.js';

describe("L'abonnement qui notifie un retour de test de maturité négatif", () => {
  it('consigne un évènement retour test maturité pour un retour négatif', async () => {
    let évènementReçu: RetourNégatifSurMiniTest;
    const messagerieInstantanee = {
      ...fausseMessagerieInstantanee,
      notifieUnRetourNégatifSurMiniTest: async (donneesEvenement: RetourNégatifSurMiniTest) => {
        évènementReçu = donneesEvenement;
      },
    };
    await notifieUnRetourNégatifSurMiniTest({ messagerieInstantanee })(
      new RetourMiniTestDonné({
        miniTest: 'test-maturité',
        commentaire: "J'aime pas",
        retour: 'NEGATIF',
      })
    );

    expect(évènementReçu!.miniTest).toBe('test-maturité');
    expect(évènementReçu!.commentaire).toBe("J'aime pas");
  });

  it('ne consigne un évènement pour un retour positif', async () => {
    let estAppelé = false;

    const messagerieInstantanee = {
      ...fausseMessagerieInstantanee,
      notifieUnRetourNégatifSurMiniTest: async () => {
        estAppelé = true;
      },
    };
    await notifieUnRetourNégatifSurMiniTest({ messagerieInstantanee })(
      new RetourMiniTestDonné({
        miniTest: 'test-maturité',
        commentaire: "J'aime",
        retour: 'POSITIF',
      })
    );

    expect(estAppelé).toBe(false);
  });
});
