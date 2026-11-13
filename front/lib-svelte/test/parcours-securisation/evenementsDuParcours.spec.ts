import { beforeEach, describe, expect, it, vi } from 'vitest';
import { créeÉvènementsDuParcours } from '../../src/parcours-securisation/evenementsDuParcours';
import { stockageDeSession } from '../../src/utils/stockageDeSession';

describe('les évènements du parcours', () => {
  beforeEach(() => {
    stockageDeSession.efface();
  });

  it('traite un module terminé', () => {
    const événements = créeÉvènementsDuParcours(() => stockageDeSession);
    const surModuleTerminé = vi.fn();

    événements.publieModuleTerminé();
    événements.traiteModuleTerminé(surModuleTerminé);

    expect(surModuleTerminé).toHaveBeenCalled();
  });

  it('ne traite pas de module terminé si un parcours terminé est publié en premier', () => {
    const événements = créeÉvènementsDuParcours(() => stockageDeSession);
    const surModuleTerminé = vi.fn();

    événements.publieParcoursCompletTerminé();
    événements.publieModuleTerminé();
    événements.traiteModuleTerminé(surModuleTerminé);

    expect(surModuleTerminé).not.toHaveBeenCalled();
  });

  it('ne traite pas de module terminé si un parcours terminé est publié ensuite', () => {
    const événements = créeÉvènementsDuParcours(() => stockageDeSession);
    const surModuleTerminé = vi.fn();

    événements.publieModuleTerminé();
    événements.publieParcoursCompletTerminé();
    événements.traiteModuleTerminé(surModuleTerminé);

    expect(surModuleTerminé).not.toHaveBeenCalled();
  });
});
