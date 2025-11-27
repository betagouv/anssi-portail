<script lang="ts">
  import BoutonFavori from '../favoris/BoutonFavori.svelte';
  import { type ItemCyber, Typologie } from './Catalogue.types';
  import type { Guide } from './Guide.types';
  import BadgesDeCollections from './guides/BadgesDeCollections.svelte';

  export let item: ItemCyber | Guide;
  export let avecBoutonFavori: boolean = false;

  const libelleBadge = (item: ItemCyber | Guide) => {
    if (item.type === 'Guide') return 'Guide';
    return item.typologie === Typologie.SERVICE
      ? 'Service'
      : item.typologie === Typologie.OUTIL
        ? 'Outil'
        : item.format;
  };

  const tronque = (texte: string) => {
    const LONGUEUR_MAX = 54;
    return texte?.length > LONGUEUR_MAX
      ? texte.slice(0, LONGUEUR_MAX) + '&hellip;'
      : texte;
  };
</script>

<figure>
  {#if item.type === 'Guide'}
    <img src={item.illustration.petite} alt="Illustration du guide" />
    <div class="badges-collection"><BadgesDeCollections guide={item} /></div>
  {:else}
    <img
      src="/assets/images/illustrations-services/{item.illustration}"
      alt="Illustration du service"
    />
    <figcaption>{libelleBadge(item)}</figcaption>
  {/if}
</figure>
<div class="contenu">
  <div class="en-tete">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <div class="nom-item">{@html item.nom}</div>
    {#if avecBoutonFavori}
      <BoutonFavori idItem={item.id} />
    {/if}
  </div>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  <span class="description">{@html tronque(item.description)}</span>
  <div class="labels">
    {#if item.sources}
      {#each item.sources as source (source)}<span>{source}</span>{/each}
    {/if}
    {#if item.lienInterne || (item.type !== 'Guide' && item.lienExterne)}
      <img
        src={`/assets/images/${
          item.lienInterne
            ? 'icone-fleche-droite.svg'
            : 'icone-lien-externe.svg'
        }`}
        alt={item.lienInterne
          ? 'Voir le détail'
          : 'Ouvrir dans un nouvel onglet'}
        title={item.lienInterne
          ? 'Voir le détail'
          : 'Ouvrir dans un nouvel onglet'}
      />
    {/if}
  </div>
</div>

<style lang="scss">
  figure {
    .badges-collection {
      position: absolute;
      top: 12px;
      right: 12px;
      left: 12px;
      width: 100%;
    }
  }
  .contenu {
    background: white;
    z-index: 1;
    border-bottom: 4px solid black;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;

    .en-tete {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .nom-item {
      margin: 0;
      padding: 0;
      font-size: 0.875rem;
      line-height: 1.5rem;
      font-weight: 400;
    }

    .description {
      font-weight: bold;
      font-size: 1.125rem;
      line-height: 1.5rem;
    }

    .labels {
      span {
        font-size: 0.75rem;
        line-height: 1.25rem;
      }

      img {
        width: 20px;
        height: 20px;
      }
    }
  }
</style>
