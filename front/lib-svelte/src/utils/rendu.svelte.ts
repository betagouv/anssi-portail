type Affichage = 'mobile' | 'tablette' | 'bureau';

const seuilMd = '767px';
const seuilLg = '992px';

const requêteMédiaEstMobile = window.matchMedia(`(width < ${seuilMd})`);
const requêteMédiaEstTablette = window.matchMedia(`(${seuilMd} <= width < ${seuilLg})`);
const requêteMédiaEstBureauEtPlus = window.matchMedia(`(width >= ${seuilLg})`);

export const détecteRendu = () => {
  let affichage: Affichage = $state('bureau');

  $effect(() => {
    affichage = requêteMédiaEstMobile.matches ? 'mobile' : requêteMédiaEstTablette.matches ? 'tablette' : 'bureau';

    const surChangementMédiaMobile = (évènement: MediaQueryListEvent) => {
      if (évènement.matches) affichage = 'mobile';
    };

    const surChangementMédiaTablette = (évènement: MediaQueryListEvent) => {
      if (évènement.matches) affichage = 'tablette';
    };

    const surChangementMédiaBureau = (évènement: MediaQueryListEvent) => {
      if (évènement.matches) affichage = 'bureau';
    };

    requêteMédiaEstMobile.addEventListener('change', surChangementMédiaMobile);
    requêteMédiaEstTablette.addEventListener('change', surChangementMédiaTablette);
    requêteMédiaEstBureauEtPlus.addEventListener('change', surChangementMédiaBureau);

    return () => {
      requêteMédiaEstMobile.removeEventListener('change', surChangementMédiaMobile);
      requêteMédiaEstTablette.removeEventListener('change', surChangementMédiaTablette);
      requêteMédiaEstBureauEtPlus.removeEventListener('change', surChangementMédiaBureau);
    };
  });

  return {
    get estMobile() {
      return affichage === 'mobile';
    },

    get estPlusPetitQueBureau() {
      return ['mobile', 'tablette'].includes(affichage);
    },

    get estBureau() {
      return affichage === 'bureau';
    },
  };
};
