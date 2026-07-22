import { hydrate } from 'svelte';
import EquipeBizDev from './interlocuteurs/EquipeBizDev.svelte';

hydrate(EquipeBizDev, {
  target: document.getElementById('equipe-biz-dev')!,
});
