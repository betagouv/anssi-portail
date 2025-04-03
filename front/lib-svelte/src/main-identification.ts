import { mount } from "svelte";
import ZoneIdentification from './identification/ZoneIdentification.svelte';

mount(ZoneIdentification, {
  target: document.getElementById('zone-identification')!,
});
