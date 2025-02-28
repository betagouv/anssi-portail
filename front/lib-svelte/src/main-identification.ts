import { mount } from "svelte";
import ZoneIdentification from './identification/ZoneIdentification.svelte';

const zoneIdentification = mount(ZoneIdentification, {
  target: document.getElementById("zone-identification")!,
});

export default zoneIdentification;