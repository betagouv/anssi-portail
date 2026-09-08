import { hydrate } from 'svelte';
import Financements from './financements/Financements.svelte';

const cible = document.getElementById('financements')!;
const idFinancement = cible.querySelector<HTMLElement>('[data-id-financement]')?.dataset.idFinancement;

hydrate(Financements, {
  target: cible,
  props: { idFinancement: idFinancement ? Number(idFinancement) : undefined },
});
