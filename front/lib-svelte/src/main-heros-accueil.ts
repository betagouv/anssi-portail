import { hydrate } from 'svelte';
import HerosAccueil from './accueil/HerosAccueil.svelte';

hydrate(HerosAccueil, {
  target: document.getElementById('heros-accueil')!,
});
