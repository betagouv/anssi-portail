import { derived } from 'svelte/store';
import { rechercheParBesoin } from './rechercheParBesoin.store';
import { rechercheParCollection } from './rechercheParCollection.store';
import { rechercheParDroitAcces } from './rechercheParDroitAcces.store';
import { rechercheParFormat } from './rechercheParFormat.store';
import { rechercheParLangue } from './rechercheParLangue.store';
import { rechercheParSource } from './rechercheParSource.store';
import { rechercheParTypologie } from './rechercheParTypologie.store';

const recherches2 = derived(
  [
    rechercheParDroitAcces,
    rechercheParBesoin,
    rechercheParTypologie,
    rechercheParFormat,
    rechercheParSource,
    rechercheParLangue,
    rechercheParCollection,
  ],
  ([
    $rechercheParDroitAcces,
    $rechercheParBesoin,
    $rechercheParTypologie,
    $rechercheParFormat,
    $rechercheParSource,
    $rechercheParLangue,
    $rechercheParCollection,
  ]) => ({
    filtreActif:
      $rechercheParDroitAcces.length !== 0 ||
      !!$rechercheParBesoin ||
      $rechercheParTypologie.length !== 0 ||
      $rechercheParFormat.length !== 0 ||
      $rechercheParSource.length !== 0 ||
      $rechercheParLangue.length !== 0 ||
      $rechercheParCollection.length !== 0,
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
    rechercheParCollection.reinitialise();
  },
};
