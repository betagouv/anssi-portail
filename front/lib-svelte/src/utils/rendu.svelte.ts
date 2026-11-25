import { onMount } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';

export type Affichage = 'mobile' | 'tablette' | 'bureau';

const seuilSm = '576px';
const seuilMd = '767px';
const seuilLg = '992px';

export const requêteMédiaMobile = `(width < ${seuilMd})`;
export const requêteMédiaTablette = `(${seuilMd} <= width < ${seuilLg})`;
export const requêteMédiaPetitÉcran = `(max-width: ${seuilSm})`;
export const requêteMédiaÀPartirDeSm = `(min-width: ${seuilSm})`;
export const requêteMédiaMouvementRéduit = '(prefers-reduced-motion: reduce)';

/**
 * Détecte une requête média de façon compatible SSR.
 *
 * Tant que le composant n'est pas monté (rendu serveur et hydratation), `correspond` vaut `valeurServeur`,
 * ce qui garantit un premier rendu client identique au HTML serveur. Après montage, la valeur suit la requête.
 *
 * À appeler pendant l'initialisation d'un composant.
 */
export const détecteMédia = (requête: string, valeurServeur = false) => {
  const requêteMédia = new MediaQuery(requête, valeurServeur);
  let monté = $state(false);

  onMount(() => {
    monté = true;
  });

  return {
    get correspond() {
      return monté ? requêteMédia.current : valeurServeur;
    },
  };
};

export const détecteRendu = () => {
  const estMobile = détecteMédia(requêteMédiaMobile);
  const estTablette = détecteMédia(requêteMédiaTablette);

  const affichage: Affichage = $derived(
    estMobile.correspond ? 'mobile' : estTablette.correspond ? 'tablette' : 'bureau'
  );

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
