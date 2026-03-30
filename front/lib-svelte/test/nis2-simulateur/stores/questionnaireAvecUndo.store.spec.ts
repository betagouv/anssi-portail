import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { questionnaireAvecUndo } from '../../../src/nis2-simulateur/stores/questionnaireAvecUndo.store';

describe("Le store du questionnaire qui permet de faire de l'UNDO", () => {
  it('existe', () => {
    const store = questionnaireAvecUndo;

    expect(get(store).etapeCourante).toEqual('prealable');
  });

  it('permet de revenir en arrière après une réponse', () => {
    const store = questionnaireAvecUndo;

    store.repond({ type: 'VALIDE_ETAPE_PREALABLE' });
    expect(get(store).etapeCourante).toBe(
      'designationOperateurServicesEssentiels'
    );

    store.undo();

    expect(get(store).etapeCourante).toBe('prealable');
  });
});
