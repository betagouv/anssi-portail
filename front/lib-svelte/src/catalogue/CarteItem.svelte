<script lang="ts">
  import { type ItemCyber, Typologie } from "./Catalogue.types";

  export let itemCyber: ItemCyber;

  const libelleBadge = (item: ItemCyber) =>
    item.typologie === Typologie.SERVICE ? "Service" : item.format;

  const tronque = (texte: string) => {
    const LONGUEUR_MAX = 54;
    return texte.length > LONGUEUR_MAX
      ? texte.slice(0, LONGUEUR_MAX) + "&hellip;"
      : texte;
  };
</script>

<a
  class="carte {itemCyber.typologie}"
  target={itemCyber.lienInterne ? "" : "_blank"}
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
    <div class="nom-item">{@html itemCyber.nom}</div>
    <span class="description">{@html tronque(itemCyber.description)}</span>
    <div class="labels">
      {#each itemCyber.sources as source}<span>{source}</span>{/each}
      <img
        src={`/assets/images/${
          itemCyber.lienInterne
            ? "icone-fleche-droite.svg"
            : "icone-lien-externe.svg"
        }`}
        alt={itemCyber.lienInterne
          ? "Voir le détail"
          : "Ouvrir dans un nouvel onglet"}
        title={itemCyber.lienInterne
          ? "Voir le détail"
          : "Ouvrir dans un nouvel onglet"}
      />
    </div>
  </div>
</a>
