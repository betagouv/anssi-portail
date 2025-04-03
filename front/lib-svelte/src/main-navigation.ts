import { mount } from 'svelte';
import Navigation from './navigation/Navigation.svelte';

mount(Navigation, {
  target: document.getElementById('navigation')!,
});
