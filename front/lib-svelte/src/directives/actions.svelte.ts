import type { Action } from 'svelte/action';

export const clic: Action<HTMLElement, (e: MouseEvent | KeyboardEvent) => void> = (
  element: HTMLElement,
  gestionnaireInitial: (e: MouseEvent | KeyboardEvent) => void
) => {
  let gestionnaire = gestionnaireInitial;
  let activationClavierEnCours = false;
  let minuteurFinActivation: number | undefined;

  const termineActivationClavier = () => {
    window.clearTimeout(minuteurFinActivation);
    activationClavierEnCours = false;
  };

  const retireEtatActifAuClavier = () => {
    element.removeAttribute('data-actif-au-clavier');
  };

  const programmeFinActivationClavier = () => {
    window.clearTimeout(minuteurFinActivation);
    minuteurFinActivation = window.setTimeout(termineActivationClavier);
  };

  const gereLeClic = (event: MouseEvent) => {
    if (activationClavierEnCours && event.detail === 0) return;

    gestionnaire(event);
  };

  const gereLeClavier = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    activationClavierEnCours = true;
    element.setAttribute('data-actif-au-clavier', '');

    if (!event.repeat) gestionnaire(event);
    if (event.key === 'Enter') programmeFinActivationClavier();
  };

  const gereLeRelachementClavier = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    retireEtatActifAuClavier();
    if (event.key === ' ') programmeFinActivationClavier();
  };

  const gereLaPerteDeFocus = () => {
    termineActivationClavier();
    retireEtatActifAuClavier();
  };

  element.addEventListener('click', gereLeClic);
  element.addEventListener('keydown', gereLeClavier, true);
  element.addEventListener('keyup', gereLeRelachementClavier, true);
  element.addEventListener('blur', gereLaPerteDeFocus, true);

  return {
    update(nouveauGestionnaire) {
      gestionnaire = nouveauGestionnaire;
    },
    destroy() {
      gereLaPerteDeFocus();
      element.removeEventListener('click', gereLeClic);
      element.removeEventListener('keydown', gereLeClavier, true);
      element.removeEventListener('keyup', gereLeRelachementClavier, true);
      element.removeEventListener('blur', gereLaPerteDeFocus, true);
    },
  };
};
