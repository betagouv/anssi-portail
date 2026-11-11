import { mount } from 'svelte';
import Module from './parcours-securisation/module/Module.svelte';

mount(Module, {
  target: document.getElementById('module')!,
});
