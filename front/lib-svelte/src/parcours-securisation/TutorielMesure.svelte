<script lang="ts">
  import type { Mesure } from './mesure';

  const { mesure }: { mesure: Mesure } = $props();
</script>

<div class="contenu-section">
  <h2>Comment faire concrètement</h2>
  <dsfr-card
    hasBadge
    title={mesure.tutoriel?.titre ?? 'Titre'}
    horizontal
    actionMarkup="button"
    src={mesure.tutoriel?.image ?? '/assets/images/image-generique.avif'}
    imageRatio="16x9"
    horizontalProportion="tier"
    size="lg"
  >
    <dsfr-badge slot="badgesgroup" label="Tutoriel" type="accent" accent="purple-glycine"></dsfr-badge>
  </dsfr-card>
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
