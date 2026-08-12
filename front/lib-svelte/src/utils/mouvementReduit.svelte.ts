const REQUÊTE_MOUVEMENT_RÉDUIT = '(prefers-reduced-motion: reduce)';

export const préfèreMouvementRéduit = () => {
  let réduit = $state(false);

  $effect(() => {
    const requête = window.matchMedia(REQUÊTE_MOUVEMENT_RÉDUIT);
    réduit = requête.matches;

    const surChangement = (évènement: MediaQueryListEvent) => {
      réduit = évènement.matches;
    };
    requête.addEventListener('change', surChangement);

    return () => {
      requête.removeEventListener('change', surChangement);
    };
  });

  return {
    get réduit() {
      return réduit;
    },
  };
};
