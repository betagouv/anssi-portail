import { render } from 'svelte/server';
import Page from './protection/entreprises/PresentationEntreprises.svelte';

export const renderApp = () => render(Page);
