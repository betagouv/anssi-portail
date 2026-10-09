<script lang="ts">
  import { untrack } from 'svelte';
  import { clic } from '../../directives/actions.svelte';
  import type { Mesure } from './../mesure';
  import ModaleTutoriel from './ModaleTutoriel.svelte';

  const { mesure }: { mesure: Mesure } = $props();
  let étatDesModales: boolean[] = $state(untrack(() => Array(mesure.procédures.length).fill(false)));
  const aDesTutoriels: boolean = $derived(mesure.procédures.length > 0);
  const aDesLiens: boolean = $derived(mesure.liens?.length > 0);

  const selectionneLeTutoriel = (index: number) => {
    étatDesModales[index] = true;
    const tutoriel = mesure.procédures.at(index);
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
    {#each mesure.procédures as tutoriel, index (index)}
      <dsfr-card
        hasBadge
        title={tutoriel.titre}
        horizontal
        horizontalProportion="tier"
        size="sm"
        actionMarkup="button"
        role="button"
        use:clic={() => selectionneLeTutoriel(index)}
      >
        <dsfr-badge slot="badgesgroup" label="Boite à outils" type="accent" accent="purple-glycine"></dsfr-badge>
      </dsfr-card>

      <ModaleTutoriel {tutoriel} bind:estOuverte={étatDesModales[index]} />
    {/each}
  </div>
{/if}

<style lang="scss">
  .contenu-section {
    dsfr-card {
      min-height: 0;
      margin-bottom: 1rem;

      dsfr-badge {
        margin-bottom: 0.75rem;
      }
    }
  }
</style>
