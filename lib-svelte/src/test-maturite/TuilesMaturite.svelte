<script lang="ts">
  import { type NiveauMaturite, niveauxMaturite } from "./TestMaturite.donnees";

  export let niveauCourant: NiveauMaturite;

  $: indexNiveauCourant = niveauxMaturite.indexOf(niveauCourant);
</script>

<div class="tuiles-niveau">
  {#each niveauxMaturite as niveau, index}
    <div
      class="tuile-niveau"
      class:actif={index < indexNiveauCourant}
      class:courant={index === indexNiveauCourant}
      class:inactif={index > indexNiveauCourant}
    >
      <img class="illustration" src="/assets/images/test-maturite/niveaux/{niveau.id}.svg" alt="Niveau de maturité">
      <img class="coche" alt="" src="/assets/images/coche-ronde.svg">
      <span>{niveau.label}</span>
    </div>
  {/each}
</div>
