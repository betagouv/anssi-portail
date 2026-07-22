import { hydrate } from 'svelte';
import CarrouselDesInterlocuteurs from './interlocuteurs/CarrouselDesInterlocuteurs.svelte';

hydrate(CarrouselDesInterlocuteurs, {
  target: document.getElementById('carrousel-des-interlocuteurs')!,
});
