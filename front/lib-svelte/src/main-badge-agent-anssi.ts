import { mount } from 'svelte';
import BadgeAgentAnssi from './badge-agent-anssi/BadgeAgentAnssi.svelte';

const zones = document.getElementsByClassName('badge-agent-anssi');

for (const zone of zones) {
  mount(BadgeAgentAnssi, {
    target: zone,
  });
}
