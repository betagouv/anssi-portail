import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { rapporteEvenementGuideTelechargeDansTraqueur } from '../../src/bus/rapporteEvenementGuideTelechargeDansTraqueur';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurAnalytique } from '../../src/infra/adaptateurAnalytique';
import { GuideTelecharge } from '../../src/bus/evenements/guideTelecharge';

describe("L'abonnement qui rapporte le téléchargement d'un guide dans Matomo", () => {
  let adaptateurAnalytique: AdaptateurAnalytique;
  let adaptateurHorloge: AdaptateurHorloge;

  beforeEach(() => {
    adaptateurAnalytique = {
      rapporteEvenement: async () => {},
    };
    adaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };
  });

  const rapporteEvenementDansMatomo = () => {
    return rapporteEvenementGuideTelechargeDansTraqueur({
      adaptateurAnalytique,
      adaptateurHorloge,
    });
  };

  it('écoute un évènement de GuideTecharge', async () => {
    let evenementRecu;
    adaptateurAnalytique = {
      rapporteEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };

    await rapporteEvenementDansMatomo()(
      new GuideTelecharge({ id: 'zero-trust' })
    );

    assert.notEqual(evenementRecu, undefined);
    assert.equal(evenementRecu!.type, 'GUIDE_TELECHARGE');
    assert.equal(evenementRecu!.donnees.id, 'zero-trust');
    assert.deepEqual(evenementRecu!.date, new Date('2025-03-10'));
  });
});
