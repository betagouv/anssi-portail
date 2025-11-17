import { derived } from 'svelte/store';
import { rechercheParBesoin } from './rechercheParBesoin.store';
import { rechercheParDroitAcces } from './rechercheParDroitAcces.store';
import { rechercheParTypologie } from './rechercheParTypologie.store';
import { rechercheParFormat } from './rechercheParFormat.store';
import { rechercheParSource } from './rechercheParSource.store';
import { rechercheParLangue } from './rechercheParLangue.store';

const recherches2 = derived(
  [
    rechercheParDroitAcces,
    rechercheParBesoin,
    rechercheParTypologie,
    rechercheParFormat,
    rechercheParSource,
    rechercheParLangue,
  ],
  ([
    $rechercheParDroitAcces,
    $rechercheParBesoin,
    $rechercheParTypologie,
    $rechercheParFormat,
    $rechercheParSource,
    $rechercheParLangue,
  ]) => ({
    filtreActif:
      $rechercheParDroitAcces.length !== 0 ||
      !!$rechercheParBesoin ||
      $rechercheParTypologie.length !== 0 ||
      $rechercheParFormat.length !== 0 ||
      $rechercheParSource.length !== 0 ||
      $rechercheParLangue.length !== 0,
  })
);

export const recherches = {
  subscribe: recherches2.subscribe,
  reinitialise: () => {
    rechercheParBesoin.reinitialise();
    rechercheParDroitAcces.reinitialise();
    rechercheParTypologie.reinitialise();
    rechercheParFormat.reinitialise();
    rechercheParSource.reinitialise();
    rechercheParLangue.reinitialise();
  },
};
