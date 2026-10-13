<script lang="ts">
  import { clic } from '../../directives/actions.svelte';
  import type { Mesure } from './../mesure';

  const { mesure, surSélectionProcédure }: { mesure: Mesure; surSélectionProcédure: () => void } = $props();
  const aDesProcédures: boolean = $derived(mesure.procédures.length > 0);
  const aDesLiens: boolean = $derived(mesure.liens?.length > 0);

  const selectionneLaProcédure = (index: number) => {
    surSélectionProcédure();
    const procédure = mesure.procédures.at(index);
    window._paq?.push([
      'trackEvent',
      'Parcours sécurisation',
      `Ouverture procédure ${mesure.id}`,
      procédure?.titre ?? '',
    ]);
  };
</script>

{#if aDesProcédures || aDesLiens}
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
        use:clic={() => selectionneLaProcédure(index)}
      >
        <dsfr-badge slot="badgesgroup" label="Boite à outils" type="accent" accent="purple-glycine"></dsfr-badge>
      </dsfr-card>
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
