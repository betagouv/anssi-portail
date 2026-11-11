import { beforeEach, describe, expect, it, vi } from 'vitest';
import { créeÉvènementsDuParcours } from '../../src/parcours-securisation/evenementsDuParcours';

describe('les évènements du parcours', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('traite un module terminé', () => {
    const événements = créeÉvènementsDuParcours(() => sessionStorage);
    const surModuleTerminé = vi.fn();

    événements.publieModuleTerminé();
    événements.traiteModuleTerminé(surModuleTerminé);

    expect(surModuleTerminé).toHaveBeenCalled();
  });

  it('ne traite pas de module terminé si un parcours terminé est publié en premier', () => {
    const événements = créeÉvènementsDuParcours(() => sessionStorage);
    const surModuleTerminé = vi.fn();

    événements.publieParcoursCompletTerminé();
    événements.publieModuleTerminé();
    événements.traiteModuleTerminé(surModuleTerminé);

    expect(surModuleTerminé).not.toHaveBeenCalled();
  });

  it('ne traite pas de module terminé si un parcours terminé est publié ensuite', () => {
    const événements = créeÉvènementsDuParcours(() => sessionStorage);
    const surModuleTerminé = vi.fn();

    événements.publieModuleTerminé();
    événements.publieParcoursCompletTerminé();
    événements.traiteModuleTerminé(surModuleTerminé);

    expect(surModuleTerminé).not.toHaveBeenCalled();
  });
});
