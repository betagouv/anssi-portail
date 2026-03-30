import { get } from 'svelte/store';
import type { EtatQuestionnaire } from '../../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire';
import type { ActionQuestionnaire } from './actions';
import type { questionnaireStore } from './questionnaire.store';

export function quiSupporteUndo(wrappe: typeof questionnaireStore) {
  const historique: EtatQuestionnaire[] = [];
  return {
    subscribe: wrappe.subscribe,

    repond: (reponse: ActionQuestionnaire) => {
      const courant = get(wrappe);
      historique.push(courant);
      wrappe.repond(reponse);
    },

    undo: () => {
      const dernier = historique.pop() as EtatQuestionnaire;
      wrappe.set(dernier);
    },
  };
}
