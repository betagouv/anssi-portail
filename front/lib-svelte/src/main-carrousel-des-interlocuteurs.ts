import { mount } from 'svelte';
import CarrouselDesInterlocuteurs from './interlocuteurs/CarrouselDesInterlocuteurs.svelte';

mount(CarrouselDesInterlocuteurs, {
  target: document.getElementById('carrousel-des-interlocuteurs')!,
});
