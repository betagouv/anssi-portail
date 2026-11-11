import { beforeEach, describe, expect, it, vi } from 'vitest';
import { consigneAvisParcoursDonnéDansJournal } from '../../src/bus/consigneAvisParcoursDonneDansJournal.js';
import { AvisParcoursDonné } from '../../src/bus/evenements/avisParcoursDonne.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe("L'abonnement qui consigne le don d'un avis sur un parcours dans le journal", () => {
  let adaptateurJournal: AdaptateurJournal;
  let adaptateurHorloge: AdaptateurHorloge;
  let adaptateurHachage: AdaptateurHachage;

  const unAvis = (surcharge: Partial<ConstructorParameters<typeof AvisParcoursDonné>[0]> = {}) =>
    new AvisParcoursDonné({
      typeDeRetour: 'spontané',
      niveauDUtilité: 4,
      recommandationAutreOrganisation: 'oui',
      commentaireAmélioration: 'Un commentaire libre',
      souhaiteÊtreRecontacté: true,
      parcours: 'complet',
      emailDeContact: 'jean@dupont.fr',
      pageSource: '/parcours-securisation',
      ...surcharge,
    });

  beforeEach(() => {
    adaptateurJournal = { consigneEvenement: async () => {} };
    adaptateurHorloge = { maintenant: () => new Date('2025-03-10') };
    adaptateurHachage = fauxAdaptateurHachage;
  });

  const consigne = () =>
    consigneAvisParcoursDonnéDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage });

  it("consigne l'évènement avec l'email haché", async () => {
    const consigneEvenement = vi.spyOn(adaptateurJournal, 'consigneEvenement');

    await consigne()(unAvis());

    expect(consigneEvenement).toHaveBeenCalledExactlyOnceWith({
      type: 'AVIS_PARCOURS_DONNE',
      donnees: {
        idUtilisateur: 'jean@dupont.fr-hache',
        typeDeRetour: 'spontané',
        niveauDUtilité: 4,
        recommandationAutreOrganisation: 'oui',
        commentaireAmélioration: 'Un commentaire libre',
        souhaiteÊtreRecontacté: true,
        parcours: 'complet',
        pageSource: '/parcours-securisation',
      },
      date: new Date('2025-03-10'),
    });
  });
});
