import { render } from 'svelte/server';
import Page from './protection/entreprises/PresentationEntreprises.svelte';

export function renderApp() {
  return render(Page);
}
