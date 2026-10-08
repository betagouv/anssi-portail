import { hydrate } from 'svelte';
import PageCrisp from './page-crisp/PageCrisp.svelte';

hydrate(PageCrisp, {
  target: document.getElementById('page-crisp')!,
});
