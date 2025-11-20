<script lang="ts">
  import type { Guide, ItemCyber } from './Catalogue.types';
  import ContenuCarteItem from './ContenuCarteItem.svelte';

  export let item: ItemCyber | Guide;
  export let avecBoutonFavori: boolean = false;
</script>

{#if item.type === 'Guide'}
  <a
    class="carte guide"
    href={'/guides/' + item.id}
    data-source="Guide"
    data-cible={item.nom}
  >
    <ContenuCarteItem item={{ ...item, description: item.resume }} />
  </a>
{:else if item.lienInterne || item.lienExterne}
  <a
    class="carte {item.typologie}"
    target={item.lienInterne ? '' : '_blank'}
    href={item.lienInterne ?? item.lienExterne}
    class:lien-externe-produit={!item.lienInterne}
    data-source="Catalogue"
    data-cible={item.nom}
  >
    <ContenuCarteItem {item} {avecBoutonFavori} />
  </a>
{:else}
  <div class="carte {item.typologie}">
    <ContenuCarteItem {item} {avecBoutonFavori} />
  </div>
{/if}
