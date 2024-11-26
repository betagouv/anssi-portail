<script lang="ts">
  import { type ItemCyber, Typologie } from "./Catalogue.types";

  export let itemCyber: ItemCyber;

  const libelleBadge = (item: ItemCyber) =>
    item.typologie === Typologie.SERVICE ? "Service" : item.format;
</script>

<div class="carte {itemCyber.typologie}">
  <figure>
    <img
      src="/assets/images/illustrations-services/{itemCyber.illustration}"
      alt="Illustration du service"
    />
    <figcaption>{libelleBadge(itemCyber)}</figcaption>
  </figure>
  <div class="contenu">
    <h3>{@html itemCyber.nom}</h3>
    <span>{@html itemCyber.description}</span>
    <a href={itemCyber.lienInterne}>
      En savoir plus
      <img src="/assets/images/icone-fleche-droite.svg" alt="En savoir plus" />
    </a>
    <div class="labels">
      {#each itemCyber.sources as source}<span>{source}</span>{/each}
      <a class="lien-externe" href={itemCyber.lienExterne} target="_blank" aria-label="Ouvrir le lien"
        ><img src="/assets/images/icone-lien-externe.svg" alt="Ouvrir dans un nouvel onglet" />
      </a>
    </div>
  </div>
</div>
