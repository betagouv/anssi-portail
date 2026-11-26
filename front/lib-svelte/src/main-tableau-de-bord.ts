import { mount } from 'svelte';

import type { ItemCyber, RepartitionParBesoin } from '@catalogue/Catalogue.types';
import { catalogueStore } from '@catalogue/stores/catalogue.store';
import TableauDeBord from '@tableau-de-bord/TableauDeBord.svelte';

const donnees = document.getElementById('donnees-items-cyber')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données du catalogue');

const { itemsCyber, repartition } = JSON.parse(donnees) as {
  itemsCyber: ItemCyber[];
  repartition: RepartitionParBesoin;
};

catalogueStore.initialise(itemsCyber, repartition);

mount(TableauDeBord, {
  target: document.getElementById('tableau-de-bord')!,
});
