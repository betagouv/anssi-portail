import { derived } from 'svelte/store';
import { rechercheParCollection } from './guides/rechercheParCollection.store';
import { rechercheParLangue } from './guides/rechercheParLangue.store';
import { rechercheParBesoin } from './rechercheParBesoin.store';
import { rechercheParDroitAcces } from './rechercheParDroitAcces.store';
import { rechercheParSource } from './rechercheParSource.store';
import { rechercheParTypologie } from './rechercheParTypologie.store';
import { rechercheTextuelle } from './rechercheTextuelle.store';

const recherches2 = derived(
  [
    rechercheParDroitAcces,
    rechercheParBesoin,
    rechercheParTypologie,
    rechercheParSource,
    rechercheParLangue,
    rechercheParCollection,
    rechercheTextuelle,
  ],
  ([
    $rechercheParDroitAcces,
    $rechercheParBesoin,
    $rechercheParTypologie,
    $rechercheParSource,
    $rechercheParLangue,
    $rechercheParCollection,
    $rechercheTextuelle,
  ]) => ({
    filtreActif:
      $rechercheParDroitAcces.length !== 0 ||
      !!$rechercheParBesoin ||
      $rechercheParTypologie.length !== 0 ||
      $rechercheParSource.length !== 0 ||
      $rechercheParLangue.length !== 0 ||
      $rechercheParCollection.length !== 0 ||
      $rechercheTextuelle.length > 0,
  })
);

export const recherches = {
  subscribe: recherches2.subscribe,
  reinitialise: () => {
    rechercheParBesoin.reinitialise();
    rechercheParDroitAcces.reinitialise();
    rechercheParTypologie.reinitialise();
    rechercheParSource.reinitialise();
    rechercheParLangue.reinitialise();
    rechercheParCollection.reinitialise();
    rechercheTextuelle.reinitialise();
  },
};
