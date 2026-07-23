<script lang="ts">
  import Lien from '../../ui/Lien.svelte';
  import Modale from '../../ui/Modale.svelte';
  import type { Tutoriel } from './../mesure';

  let { tutoriel, estOuverte = $bindable() }: { tutoriel: Tutoriel; estOuverte: boolean } = $props();
</script>

<Modale bind:estOuverte>
  <h4>
    {tutoriel.titre}
  </h4>

  {#if tutoriel.description}
    <p class="texte-standard-md">{tutoriel.description}</p>
  {/if}

  <h5 class="fr-h6">Étapes générales</h5>

  <ol>
    {#each tutoriel.étapes as étape, index (index)}
      <!-- eslint-disable-next-line svelte/no-at-html-tags-->
      <li>{@html étape}</li>
    {/each}
  </ol>

  {#if tutoriel.note}
    <h5 class="fr-h6">Remarque</h5>
    <p class="texte-standard-md">{tutoriel.note}</p>
  {/if}

  {#if tutoriel.lienPourAllerPlusLoin}
    <h5 class="fr-h6">Pour aller plus loin</h5>
    <Lien href={tutoriel.lienPourAllerPlusLoin.url} libelle={tutoriel.lienPourAllerPlusLoin.libelle}></Lien>
  {/if}
</Modale>
