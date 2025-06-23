import { mount } from 'svelte';
import BandeauMaintenance from './maintenance/BandeauMaintenance.svelte';

mount(BandeauMaintenance, {
  target: document.getElementById('bandeau-maintenance')!,
});
