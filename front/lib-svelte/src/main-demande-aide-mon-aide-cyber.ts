import { hydrate } from 'svelte';
import DemandeAideMAC from './demande-aide-mon-aide-cyber/DemandeAideMAC.svelte';

hydrate(DemandeAideMAC, {
  target: document.getElementById('demande-aide-mon-aide-cyber')!,
});
