<script lang="ts">
  import { clic } from '../../directives/actions.svelte';
  import Modale from '../../ui/Modale.svelte';
  import type { Referentiel, ReferentielSelectionne } from '../exigence.type';
  import { etatPanneau } from '../stores/etatPanneau.store';
  import BoutonReinitialisation from './BoutonReinitialisation.svelte';
  import PanneauComparaison from './PanneauComparaison.svelte';
  import PanneauFiltres from './PanneauFiltres.svelte';

  type Props = {
    estBureau: boolean;
    sensComparaison: 'NIS2_VERS_CIBLE' | 'SOURCE_VERS_NIS2';
    source: Referentiel;
    referentielSelectionne: ReferentielSelectionne | undefined;
    featureFlagNis2CyFun23: boolean;
  };

  let {
    estBureau,
    source,
    sensComparaison = $bindable(),
    referentielSelectionne = $bindable(),
    featureFlagNis2CyFun23,
  }: Props = $props();
</script>

<div class="panneau" class:bureau={estBureau}>
  {#if estBureau}
    <PanneauComparaison
      bind:sensComparaison
      bind:referentielSelectionne
      estBureau={true}
      {featureFlagNis2CyFun23}
    />
    <PanneauFiltres {source} cible={referentielSelectionne} {estBureau} />
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
      use:clic={() => ($etatPanneau.menuComparaisonAffiche = true)}
    ></dsfr-button>
    <Modale bind:estOuverte={$etatPanneau.menuComparaisonAffiche}>
      <h4>Comparer</h4>
      <PanneauComparaison
        bind:sensComparaison
        bind:referentielSelectionne
        estBureau={false}
        {featureFlagNis2CyFun23}
      />
      {#snippet actions()}
        <dsfr-button
          label="Afficher le tableau"
          kind="primary"
          use:clic={() => ($etatPanneau.menuComparaisonAffiche = false)}
        ></dsfr-button>
        <BoutonReinitialisation
          bind:referentielSelectionne
          bind:sensComparaison
        />
      {/snippet}
    </Modale>

    <dsfr-button
      label="Filtrer le tableau"
      has-icon
      icon-place="left"
      icon="filter-line"
      kind="secondary"
      use:clic={() => ($etatPanneau.menuFiltresAffiche = true)}
    ></dsfr-button>
    <Modale bind:estOuverte={$etatPanneau.menuFiltresAffiche}>
      <h4>Filtrer le tableau</h4>
      <PanneauFiltres {source} cible={referentielSelectionne} {estBureau} />
      {#snippet actions()}
        <dsfr-button
          label="Afficher le tableau"
          kind="primary"
          use:clic={() => ($etatPanneau.menuFiltresAffiche = false)}
        ></dsfr-button>
        <BoutonReinitialisation
          bind:referentielSelectionne
          bind:sensComparaison
        />
      {/snippet}
    </Modale>
  {/if}
</div>

<style lang="scss">
  .panneau {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &.bureau {
      align-items: stretch;
      gap: 24px;
    }

    .comparaison-libelle {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 16px;

      p {
        margin: 0;
      }
    }
  }
</style>
