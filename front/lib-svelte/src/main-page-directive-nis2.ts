import { mount } from 'svelte';
import type { ItemCyber } from './catalogue/Catalogue.types';
import Page from './nis2/PageNis2.svelte';

const donnees = document.getElementById('donnees')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données du catalogue');

const { itemsCyber } = JSON.parse(donnees) as {
  itemsCyber: ItemCyber[];
};

const donneesNis2 = document.getElementById('donnees-nis2')!.textContent ?? '';

const { featureFlagNis2Exigences, featureFlagNis2Observations } = JSON.parse(
  donneesNis2
) as {
  featureFlagNis2Exigences: boolean;
  featureFlagNis2Observations: boolean;
};

mount(Page, {
  target: document.getElementById('page-directive-nis2')!,
  props: { itemsCyber, featureFlagNis2Exigences, featureFlagNis2Observations },
});
