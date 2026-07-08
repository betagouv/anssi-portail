import { hydrate } from 'svelte';
import type { ItemCyber } from './catalogue/Catalogue.types';
import Page from './protection/collectivites/PresentationCollectivites.svelte';

const donnees = document.getElementById('donnees')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données du catalogue');

const { itemsCyber } = JSON.parse(donnees) as {
  itemsCyber: ItemCyber[];
};

hydrate(Page, {
  target: document.getElementById('collectivites')!,
  props: { itemsCyber },
});
