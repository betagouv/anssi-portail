<script lang="ts">
  import CarteItem from "./CarteItem.svelte";
  import { catalogueFiltre } from "./stores/catalogueFiltre.store";
  import FiltreBesoin from "./FiltreBesoin.svelte";
  import { BesoinCyber } from "./Catalogue.types";
  import { rechercheParBesoin } from "./stores/rechercheParBesoin.store";
  import { limitationRecherche } from "./stores/limitationRecherche";

  rechercheParBesoin.set(BesoinCyber.SENSIBILISER);
  limitationRecherche.set(3);
</script>

<div class="barre-filtre-besoin">
  <FiltreBesoin filtreTousVisible={false} />
</div>

<h2>
  Des services et ressources pour sensibiliser aux risques cyber et aux bonnes
  pratiques et former ses équipes aux enjeux de cybersécurité.
</h2>

<div class="services">
  {#each $catalogueFiltre.resultats as itemCyber}
    <CarteItem {itemCyber}></CarteItem>
  {/each}
</div>
