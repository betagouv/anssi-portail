import { mount } from 'svelte';
import DemandeDiagnosticSimplifiee from './demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';

const donnees = document.getElementById(
  'accueil-donnees-demande-diagnostic'
)!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données');

const props = JSON.parse(donnees);

mount(DemandeDiagnosticSimplifiee, {
  target: document.getElementById('demande-diagnostic')!,
  props,
});
