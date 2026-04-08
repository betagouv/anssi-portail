import { mount } from 'svelte';
import PageCrisp from './page-crisp/PageCrisp.svelte';

const donneesBrutes = document.getElementById('donnees-page-crisp')!.textContent;
if (!donneesBrutes) throw new Error('Impossible de trouver les données');

const donnees = JSON.parse(donneesBrutes);

mount(PageCrisp, {
  target: document.getElementById('page-crisp')!,
  props: {
    clePageCrisp: donnees.clePageCrisp,
  },
});
