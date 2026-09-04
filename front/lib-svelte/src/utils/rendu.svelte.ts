export const détecteRendu = () => {
  let mobile = $state(false);

  $effect(() => {
    const média = window.matchMedia('(max-width: 992px)');
    mobile = média.matches;

    const surChangement = (évènement: MediaQueryListEvent) => {
      mobile = évènement.matches;
    };
    média.addEventListener('change', surChangement);

    return () => {
      média.removeEventListener('change', surChangement);
    };
  });

  return {
    get estMobile() {
      return mobile;
    },

    get estBureau() {
      return !mobile;
    },
  };
};
