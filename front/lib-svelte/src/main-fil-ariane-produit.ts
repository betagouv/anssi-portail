import { mount } from 'svelte';
import FilArianeProduit from './ui/FilArianeProduit.svelte';

const donnees = document.getElementById('donnees')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données');

const props = JSON.parse(donnees);

mount(FilArianeProduit, { target: document.getElementById('fil-ariane-produit')!, props });
