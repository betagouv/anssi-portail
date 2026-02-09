import { mount } from 'svelte';
import Page from './demande-aide-mon-aide-cyber/presentation/PresentationDemandeDiagnostic.svelte';
import type { ItemCyber } from './catalogue/Catalogue.types';

const donnees = document.getElementById('donnees')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données du catalogue');

const { itemsCyber } = JSON.parse(donnees) as {
  itemsCyber: ItemCyber[];
};

mount(Page, {
  target: document.getElementById('page-presentation-demande-diagnostic')!,
  props: { itemsCyber },
});
