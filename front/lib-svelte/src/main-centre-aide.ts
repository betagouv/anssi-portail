import { mount } from 'svelte';
import CentreAide from './centre-aide/CentreAide.svelte';

const centreAide = mount(CentreAide, {
  target: document.getElementById('centre-aide')!,
});

export default centreAide;
