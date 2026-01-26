import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { VisaTelecharge } from '../../src/bus/evenements/visaTelecharge';
import { rapporteEvenementVisaTelechargeDansTraqueur } from '../../src/bus/rapporteEvenementVisaTelechargeDansTraqueur';
import { AdaptateurAnalytique } from '../../src/infra/adaptateurAnalytique';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';

describe("L'abonnement qui rapporte le téléchargement d'un visa dans Matomo", () => {
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
    return rapporteEvenementVisaTelechargeDansTraqueur({
      adaptateurAnalytique,
      adaptateurHorloge,
    });
  };

  it('écoute un évènement de VisaTecharge', async () => {
    let evenementRecu;
    adaptateurAnalytique = {
      rapporteEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };

    const donnees = { nomFichier: 'tl-fr.xml' };

    await rapporteEvenementDansMatomo()(new VisaTelecharge(donnees));

    assert.notEqual(evenementRecu, undefined);
    assert.equal(evenementRecu!.type, 'VISA_TELECHARGE');
    assert.deepEqual(evenementRecu!.donnees, donnees);
    assert.deepEqual(evenementRecu!.date, new Date('2025-03-10'));
  });
});
