<script lang="ts">
  import { untrack } from 'svelte';
  import type { Mesure } from './../mesure';
  import ModaleTutoriel from './ModaleTutoriel.svelte';

  const { mesure }: { mesure: Mesure } = $props();
  let étatDesModales: boolean[] = $state(untrack(() => Array(mesure.tutoriels.length).fill(false)));
  const aDesTutoriels: boolean = $derived(mesure.tutoriels.length > 0);
  const aDesLiens: boolean = $derived(mesure.liens?.length > 0);

  const selectionneLeTutoriel = (index: number) => {
    étatDesModales[index] = true;
    const tutoriel = mesure.tutoriels.at(index);
    window._paq?.push([
      'trackEvent',
      'Parcours sécurisation',
      `Ouverture tutoriel ${mesure.id}`,
      tutoriel?.titre ?? '',
    ]);
  };
</script>

{#if aDesTutoriels || aDesLiens}
  <div class="contenu-section">
    {#if aDesTutoriels}
      <h2>Comment faire concrètement</h2>
    {/if}
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

      <ModaleTutoriel {tutoriel} bind:estOuverte={étatDesModales[index]} />
    {/each}
    {#if aDesLiens}
      <div class="section-aide">
        <p class="texte-article-lg">Pour aller plus loin</p>
        {#each mesure.liens as lien (lien.libelle)}
          <msc-lien href={lien.url} libelle={lien.libelle}></msc-lien>
        {/each}
      </div>
    {/if}
  </div>
{/if}

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
