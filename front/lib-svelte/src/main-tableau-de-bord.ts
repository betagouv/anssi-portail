import { mount } from 'svelte';
import TableauDeBord from './tableau-de-bord/TableauDeBord.svelte';

mount(TableauDeBord, {
  target: document.getElementById('tableau-de-bord')!,
});
