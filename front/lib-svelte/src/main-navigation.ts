import { hydrate } from 'svelte';
import Navigation from './navigation/Navigation.svelte';

hydrate(Navigation, {
  target: document.getElementById('navigation')!,
});
