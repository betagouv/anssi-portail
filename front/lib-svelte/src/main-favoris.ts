import { mount } from 'svelte';
import Favoris from "./favoris/Favoris.svelte";

const favoris = mount(Favoris, {
  target: document.getElementById('favoris')!,
});

export default favoris;
