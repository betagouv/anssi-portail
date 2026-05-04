import { mount } from 'svelte';
import ZoneIdentification from './identification/ZoneIdentification.svelte';

const zones = document.getElementsByClassName('identification');

for (const zone of zones) {
  mount(ZoneIdentification, {
    target: zone,
  });
}
