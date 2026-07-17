import { hydrate } from 'svelte';
import FilAriane from './ui/FilAriane.svelte';

const donnees = document.getElementById('donnees-fil-ariane')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données');

const props = JSON.parse(donnees);

hydrate(FilAriane, { target: document.getElementById('fil-ariane')!, props });
