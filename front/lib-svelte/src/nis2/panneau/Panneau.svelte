<script lang="ts">
  import { clic } from '../../directives/actions.svelte';
  import Modale from '../../ui/Modale.svelte';
  import type { ReferentielSelectionne } from '../exigence.type';
  import PanneauComparaison from './PanneauComparaison.svelte';
  import PanneauFiltres from './PanneauFiltres.svelte';

  type Props = {
    estBureau: boolean;
    sensComparaison: 'NIS2_VERS_CIBLE' | 'SOURCE_VERS_NIS2';
    referentielSelectionne: ReferentielSelectionne | undefined;
  };

  let {
    estBureau,
    sensComparaison = $bindable(),
    referentielSelectionne = $bindable(),
  }: Props = $props();

  let menuComparaisonAffiche = $state(false);
</script>

{#if estBureau}
  <PanneauComparaison
    bind:sensComparaison
    bind:referentielSelectionne
    estBureau={true}
  />
  <PanneauFiltres cible={referentielSelectionne} />
{:else}
  <div class="comparaison-libelle">
    <p class="texte-standard-md">Comparer les exigences NIS 2</p>
    <p class="texte-mention-xs">
      Comparez les exigences NIS 2 avec des référentiels déjà en place au sein
      de votre organisation.
    </p>
  </div>
  <dsfr-button
    label="Comparer"
    has-icon
    icon-place="left"
    icon="arrow-left-right-line"
    kind="secondary"
    use:clic={() => (menuComparaisonAffiche = true)}
  ></dsfr-button>
  <Modale bind:estOuverte={menuComparaisonAffiche}>
    <h4>Comparer</h4>
    <PanneauComparaison
      bind:sensComparaison
      bind:referentielSelectionne
      estBureau={false}
    />
    {#snippet actions()}
      <dsfr-button
        label="Afficher le tableau"
        kind="primary"
        use:clic={() => (menuComparaisonAffiche = false)}
      ></dsfr-button>
    {/snippet}
  </Modale>
{/if}

<style lang="scss">
  .comparaison-libelle {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 16px;

    p {
      margin: 0;
    }
  }
</style>
