<script lang="ts">
  import { type ItemCyber, Typologie } from "./Catalogue.types";

  export let itemCyber: ItemCyber;

  const libelleBadge = (item: ItemCyber) =>
    item.typologie === Typologie.SERVICE ? "Service" : item.format;

  const tronque = (texte: string) => {
    const LONGUEUR_MAX = 57;
    return texte.length > LONGUEUR_MAX
      ? texte.slice(0, LONGUEUR_MAX) + "&hellip;"
      : texte;
  };
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
    <span class="description">{@html tronque(itemCyber.description)}</span>
    <div class="labels">
      {#each itemCyber.sources as source}<span>{source}</span>{/each}
      <a
        class="lien-externe"
        href={itemCyber.lienExterne}
        target="_blank"
        aria-label="Ouvrir le lien"
        ><img
          src="/assets/images/icone-lien-externe.svg"
          alt="Ouvrir dans un nouvel onglet"
        />
      </a>
    </div>
  </div>
</div>
