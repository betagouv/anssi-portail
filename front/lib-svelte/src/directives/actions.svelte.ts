import type { Action } from 'svelte/action';

export const clic: Action<
  HTMLElement,
  (e: MouseEvent | KeyboardEvent) => void
> = (
  element: HTMLElement,
  clicOuTouchePressee: (e: MouseEvent | KeyboardEvent) => void,
) => {
  const gereLeClic = (event: MouseEvent) => {
    clicOuTouchePressee(event);
  };
  const gereLeClavier = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      clicOuTouchePressee(event);
    }
  };

  element.addEventListener('click', gereLeClic);
  element.addEventListener('keydown', gereLeClavier);

  return {
    destroy() {
      element.removeEventListener('click', gereLeClic);
      element.removeEventListener('keydown', gereLeClavier);
    },
  };
};
