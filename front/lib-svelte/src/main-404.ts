import { hydrate } from 'svelte';
import Page404 from './ui/404.svelte';

hydrate(Page404, {
  target: document.getElementById('404')!,
});
