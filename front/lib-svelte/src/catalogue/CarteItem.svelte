<script lang="ts">
  import type { ItemCyber } from './Catalogue.types';
  import type { Guide } from './Guide.types';
  import ContenuCarteItem from './ContenuCarteItem.svelte';

  export let item: ItemCyber | Guide;
  export let avecBoutonFavori: boolean = false;
  export let modeLargeur: 'automatique' | 'fixe' = 'fixe';
</script>

{#if item.type === 'Guide'}
  <a
    class="carte guide {modeLargeur}"
    href={item.id}
    data-source="Guide"
    data-cible={item.nom}
  >
    <ContenuCarteItem
      item={{ ...item, description: item.resume }}
      {avecBoutonFavori}
    />
  </a>
{:else if item.lienInterne || item.lienExterne}
  <a
    class="carte {item.typologie} {modeLargeur}"
    target={item.lienInterne ? '' : '_blank'}
    href={item.lienInterne ?? item.lienExterne}
    class:lien-externe-produit={!item.lienInterne}
    data-source="Catalogue"
    data-cible={item.nom}
  >
    <ContenuCarteItem {item} {avecBoutonFavori} />
  </a>
{:else}
  <div class="carte {item.typologie} {modeLargeur}">
    <ContenuCarteItem {item} {avecBoutonFavori} />
  </div>
{/if}

<style lang="scss">
  .carte.automatique {
    width: auto;
  }
</style>
