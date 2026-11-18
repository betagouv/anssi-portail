export type Affichage = 'mobile' | 'tablette' | 'bureau';

const seuilMd = '767px';
const seuilLg = '992px';

// État partagé entre tous les composants : les requêtes média ne sont créées qu'une fois, côté client uniquement
// (`window` n'existe pas pendant le rendu serveur).
let affichage: Affichage = $state('bureau');
let abonnés = 0;
let désabonnement: (() => void) | undefined;

const démarreLaDétection = () => {
  const requêteMédiaEstMobile = window.matchMedia(`(width < ${seuilMd})`);
  const requêteMédiaEstTablette = window.matchMedia(`(${seuilMd} <= width < ${seuilLg})`);
  const requêteMédiaEstBureauEtPlus = window.matchMedia(`(width >= ${seuilLg})`);

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
};

export const détecteRendu = () => {
  $effect(() => {
    if (abonnés === 0) désabonnement = démarreLaDétection();
    abonnés++;

    return () => {
      abonnés--;
      if (abonnés === 0) {
        désabonnement?.();
        désabonnement = undefined;
      }
    };
  });

  return {
    get affichageCourant() {
      return affichage;
    },

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
