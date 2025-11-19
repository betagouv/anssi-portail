import { mount } from 'svelte';
import Catalogue from './catalogue/Catalogue.svelte';
import {
  type ItemCyber,
  type RepartitionParBesoin,
} from './catalogue/Catalogue.types';
import { catalogueStore } from './catalogue/stores/catalogue.store';

const donnees = document.getElementById('donnees')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données du catalogue');

const { itemsCyber, repartition, featureFlagGuides } = JSON.parse(donnees) as {
  itemsCyber: ItemCyber[];
  repartition: RepartitionParBesoin;
  featureFlagGuides: boolean;
};

catalogueStore.initialise(itemsCyber, repartition);

mount(Catalogue, {
  target: document.getElementById('catalogue')!,
  props: { featureFlagGuides },
});
