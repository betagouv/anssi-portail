<script lang="ts">
  import CarteItem from "./CarteItem.svelte";
  import { catalogueFiltre } from "./stores/catalogueFiltre.store";
  import FiltreBesoin from "./FiltreBesoin.svelte";
  import { BesoinCyber } from "./Catalogue.types";
  import { rechercheParBesoin } from "./stores/rechercheParBesoin.store";
  import { limitationRecherche } from "./stores/limitationRecherche";

  rechercheParBesoin.set(BesoinCyber.SENSIBILISER_ET_FORMER);
  limitationRecherche.set(3);
</script>

<div class="barre-filtre-besoin">
  <div class="contenu-section">
    <FiltreBesoin filtreTousVisible={false} />
  </div>
</div>

<h2>
  Des services pour comprendre la cyber, être sensibilisé, mais aussi se former
  et former ses équipes à la cybersécurité.
</h2>

<section class="services-dispos">
  <div class="contenu-section">
    {#each $catalogueFiltre.resultats as itemCyber}
      <CarteItem {itemCyber}></CarteItem>
    {/each}
  </div>
</section>
