import { mount } from 'svelte';
import Financements from './financements/Financements.svelte';

mount(Financements, {
  target: document.getElementById('financements')!,
});
