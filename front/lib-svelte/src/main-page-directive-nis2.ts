import { hydrate } from 'svelte';
import type { ItemCyber } from './catalogue/Catalogue.types';
import Page from './nis2/PageNis2.svelte';

const donnees = document.getElementById('donnees-items-cyber')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données du catalogue');

const { itemsCyber } = JSON.parse(donnees) as {
  itemsCyber: ItemCyber[];
};

hydrate(Page, {
  target: document.getElementById('page-directive-nis2')!,
  props: {
    itemsCyber,
  },
});
