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
    <div class="bloc-note">
      <h5 class="fr-h6 petit-titre">Remarque</h5>
      <p class="texte-standard-md">{tutoriel.note}</p>
    </div>
  {/if}

  {#if tutoriel.lienPourAllerPlusLoin}
    <div class="bloc-pour-aller-plus-loin">
      <h5 class="fr-h6 petit-titre">Pour aller plus loin</h5>
      <Lien href={tutoriel.lienPourAllerPlusLoin.url} libelle={tutoriel.lienPourAllerPlusLoin.libelle}></Lien>
    </div>
  {/if}
</Modale>

<style lang="scss">
  h4 {
    margin-bottom: 1rem;
  }

  .bloc-note {
    margin-bottom: 1.5rem;
  }

  .bloc-pour-aller-plus-loin {
    margin-bottom: 0.5rem;
  }

  .petit-titre {
    margin-bottom: 1rem;
  }

  ol {
    --largeur-numéro: 2.5rem;
    --espacement-numéro: 1rem;
    --largeur-totale: calc(var(--largeur-numéro) + var(--espacement-numéro));

    counter-reset: item;
    list-style: none;
    margin: 0 0 1.5rem 0;
    padding: 1rem 0;

    li {
      counter-increment: item;
      position: relative;

      padding-block: 1.5rem;
      padding-inline-start: var(--largeur-totale);

      &::before {
        content: counter(item);

        position: absolute;
        inset-block-start: 1.5rem;
        inset-inline-start: 0;

        display: grid;
        place-items: center;

        inline-size: var(--largeur-numéro);
        block-size: var(--largeur-numéro);
        border-radius: 50%;

        background-color: var(--background-alt-blue-france);
        color: var(--text-title-blue-france);

        font-size: 1.375rem;
        font-weight: 700;
        text-align: center;
      }

      &:not(:last-child)::after {
        content: '';

        position: absolute;
        inset-block-end: 0;
        inset-inline-start: var(--largeur-totale);
        inset-inline-end: 0;

        block-size: 1px;
        background-color: var(--border-default-grey);
      }

      &:first-child {
        padding-block-start: 0;

        &::before {
          inset-block-start: 0;
        }
      }

      &:last-child {
        padding-block-end: 0;
      }
    }
  }
</style>
