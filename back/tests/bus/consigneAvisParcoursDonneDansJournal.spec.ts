import { beforeEach, describe, expect, it, vi } from 'vitest';

import { consigneAvisParcoursDonnéDansJournal } from '@bus/consigneAvisParcoursDonneDansJournal.js';
import { AvisParcoursDonné } from '@bus/evenements/avisParcoursDonne.js';
import { AdaptateurHachage } from '@infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '@infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';

import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne le don d'un avis sur un parcours dans le journal", () => {
  let adaptateurJournal: AdaptateurJournal;
  let adaptateurHorloge: AdaptateurHorloge;
  let adaptateurHachage: AdaptateurHachage;

  const unAvis = () =>
    new AvisParcoursDonné({
      typeDeRetour: 'spontané',
      niveauDUtilité: 4,
      recommandationAutreOrganisation: 'oui',
      commentaireAmélioration: 'Un commentaire libre',
      souhaiteÊtreRecontacté: true,
      parcours: 'complet',
      emailDeContact: 'jean@dupont.fr',
      pageSource: '/parcours-securisation',
    });

  beforeEach(() => {
    adaptateurJournal = { consigneEvenement: async () => {} };
    adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');
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
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
