import { hydrate } from 'svelte';
import ProtegerOrganisation from './accueil/ProtegerOrganisation.svelte';

hydrate(ProtegerOrganisation, {
  target: document.getElementById('proteger-organisation')!,
});
