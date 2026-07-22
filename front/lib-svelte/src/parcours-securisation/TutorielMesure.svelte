<script lang="ts">
  import Lien from '../ui/Lien.svelte';
  import Modale from '../ui/Modale.svelte';
  import type { Mesure } from './mesure';

  const { mesure }: { mesure: Mesure } = $props();
  // svelte-ignore state_referenced_locally
  let étatDesModales: boolean[] = $state(Array(mesure.tutoriels.length).fill(false));

  const selectionneLeTutoriel = (index: number) => {
    étatDesModales[index] = true;
  };
</script>

<div class="contenu-section">
  <h2>Comment faire concrètement</h2>
  {#each mesure.tutoriels as tutoriel, index (index)}
    <dsfr-card
      hasBadge
      title={tutoriel.titre}
      horizontal
      horizontalProportion="tier"
      size="lg"
      actionMarkup="button"
      role="button"
      tabindex={null}
      onkeypress={(event: KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'Space') selectionneLeTutoriel(index);
      }}
      onclick={() => selectionneLeTutoriel(index)}
    >
      <dsfr-badge slot="badgesgroup" label="Tutoriel" type="accent" accent="purple-glycine"></dsfr-badge>
    </dsfr-card>

    <Modale bind:estOuverte={étatDesModales[index]}>
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
  {/each}
  {#if mesure.liens?.length > 0}
    <div class="section-aide">
      <p class="texte-article-lg">Pour aller plus loin</p>
      {#each mesure.liens as lien (lien.libelle)}
        <msc-lien href={lien.url} libelle={lien.libelle}></msc-lien>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .contenu-section {
    margin-bottom: 2rem;

    dsfr-card {
      min-height: 0;
      margin-bottom: 1.5rem;

      dsfr-badge {
        margin-bottom: 0.75rem;
      }
    }

    .section-aide {
      margin-bottom: 3rem;

      .texte-article-lg {
        font-weight: bold;
        color: var(--text-title-grey);
      }
    }
  }
</style>
