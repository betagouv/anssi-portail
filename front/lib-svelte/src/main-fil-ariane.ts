import { mount } from 'svelte';
import FilAriane from './ui/FilAriane.svelte';

const donnees = document.getElementById('donnees')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données');

const props = JSON.parse(donnees);

mount(FilAriane, { target: document.getElementById('fil-ariane')!, props });
