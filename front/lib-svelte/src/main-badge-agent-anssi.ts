import { mount } from "svelte";
import BadgeAgentAnssi from "./badge-agent-anssi/BadgeAgentAnssi.svelte";

mount(BadgeAgentAnssi, {
  target: document.getElementById('zone-badge-agent-anssi')!,
});
