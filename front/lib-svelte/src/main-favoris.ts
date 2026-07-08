import { mount } from 'svelte';
import MesFavoris from './favoris/MesFavoris.svelte';
import type { ItemCyber } from './catalogue/Catalogue.types';
import { catalogueStore } from './catalogue/stores/catalogue.store';

const donnees = document.getElementById('donnees-items-cyber')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données du catalogue');

const { itemsCyber } = JSON.parse(donnees) as { itemsCyber: ItemCyber[] };

catalogueStore.initialise(itemsCyber);

mount(MesFavoris, {
  target: document.getElementById('favoris')!,
});
