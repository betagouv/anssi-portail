<script lang="ts">
  import { type ItemCyber, Typologie } from './Catalogue.types';
  import BoutonFavori from '../favoris/BoutonFavori.svelte';

  export let itemCyber: ItemCyber;
  export let avecBoutonFavori: boolean = false;

  const libelleBadge = (item: ItemCyber) =>
    item.typologie === Typologie.SERVICE ? 'Service' : item.format;

  const tronque = (texte: string) => {
    const LONGUEUR_MAX = 54;
    return texte.length > LONGUEUR_MAX
      ? texte.slice(0, LONGUEUR_MAX) + '&hellip;'
      : texte;
  };
</script>

<a
  class="carte {itemCyber.typologie}"
  target={itemCyber.lienInterne ? '' : '_blank'}
  href={itemCyber.lienInterne ?? itemCyber.lienExterne}
  class:lien-externe-produit={!itemCyber.lienInterne}
  data-source="Catalogue"
  data-cible={itemCyber.nom}
>
  <figure>
    <img
      src="/assets/images/illustrations-services/{itemCyber.illustration}"
      alt="Illustration du service"
    />
    <figcaption>{libelleBadge(itemCyber)}</figcaption>
  </figure>
  <div class="contenu">
    <div class="en-tete">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <div class="nom-item">{@html itemCyber.nom}</div>
      {#if avecBoutonFavori}
        <BoutonFavori idItemCyber={itemCyber.id} />
      {/if}
    </div>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <span class="description">{@html tronque(itemCyber.description)}</span>
    <div class="labels">
      {#each itemCyber.sources as source}<span>{source}</span>{/each}
      <img
        src={`/assets/images/${
          itemCyber.lienInterne
            ? 'icone-fleche-droite.svg'
            : 'icone-lien-externe.svg'
        }`}
        alt={itemCyber.lienInterne
          ? 'Voir le détail'
          : 'Ouvrir dans un nouvel onglet'}
        title={itemCyber.lienInterne
          ? 'Voir le détail'
          : 'Ouvrir dans un nouvel onglet'}
      />
    </div>
  </div>
</a>

<style lang="scss">
  .contenu {
    background: white;
    z-index: 1;
    border-bottom: 4px solid black;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .en-tete {
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    a {
      display: flex;
      align-items: center;
      gap: 3px;
      text-decoration: none;
      font-size: 0.875rem;
      line-height: 1.5rem;
      color: var(--noir);
      font-weight: bold;
    }

    .labels {
      span {
        font-size: 0.75rem;
        line-height: 1.25rem;
      }

      a.lien-externe {
        margin-left: auto;

        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .carte.service.lien-externe-produit > * {
    pointer-events: none;
  }
</style>
