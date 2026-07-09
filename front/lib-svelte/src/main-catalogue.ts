import { hydrate } from 'svelte';
import Catalogue from './catalogue/Catalogue.svelte';
import { type ItemCyber, type RepartitionParBesoin } from './catalogue/Catalogue.types';
import { catalogueStore } from './catalogue/stores/catalogue.store';

const donnees = document.getElementById('donnees-items-cyber')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données du catalogue');

const { itemsCyber, repartition } = JSON.parse(donnees) as {
  itemsCyber: ItemCyber[];
  repartition: RepartitionParBesoin;
};

catalogueStore.initialise(itemsCyber, repartition);

hydrate(Catalogue, {
  target: document.getElementById('catalogue')!,
});
