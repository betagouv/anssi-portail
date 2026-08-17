type Options = {
  seuil?: number;
  marge?: string;
};

export const suitLaVisibilité = (
  cible: () => HTMLElement | undefined,
  { seuil = 0.2, marge = '0px' }: Options = {}
) => {
  let visible = $state(true);

  $effect(() => {
    const élément = cible();
    if (!élément) {
      return;
    }

    const observateur = new IntersectionObserver(
      ([entrée]) => {
        visible = entrée.isIntersecting;
      },
      { threshold: seuil, rootMargin: marge }
    );
    observateur.observe(élément);

    return () => {
      observateur.disconnect();
    };
  });

  return {
    get visible() {
      return visible;
    },
  };
};
