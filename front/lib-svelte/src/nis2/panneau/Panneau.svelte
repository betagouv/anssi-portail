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
    referentielSelectionne: ReferentielSelectionne | '';
    langueSelectionnee: 'FR' | 'EN';
    featureFlagNis2CyFun23: boolean;
  };

  let {
    estBureau,
    source,
    sensComparaison = $bindable(),
    referentielSelectionne = $bindable(),
    langueSelectionnee = $bindable('FR'),
    featureFlagNis2CyFun23,
  }: Props = $props();

  const explications: string | undefined = $derived.by(() => {
    switch (referentielSelectionne) {
      case 'ISO':
        return "Les normes ISO étant protégées par le droit d’auteur, pour accéder au contenu complet de ces normes, il convient de se référer aux publications officielles de l'ISO et de l'IEC.";
      case 'CyFun23':
        return "Cette comparaison a bénéficié d'échanges techniques avec le Centre pour la Cybersécurité Belgique (CCB).";
    }
  });
</script>

<div class="panneau" class:bureau={estBureau}>
  {#if estBureau}
    <PanneauComparaison
      bind:sensComparaison
      bind:referentielSelectionne
      estBureau={true}
      {featureFlagNis2CyFun23}
      bind:langueSelectionnee
    />
    {#if explications}
      <p class="texte-detail-sm">{explications}</p>
    {/if}
    <PanneauFiltres {source} cible={referentielSelectionne} {estBureau} />
  {:else}
    <dsfr-button
      label="Comparer ReCyF (NIS 2)"
      has-icon
      icon-place="left"
      icon="arrow-left-right-line"
      kind="secondary"
      use:clic={() => ($etatPanneau.menuComparaisonAffiche = true)}
    ></dsfr-button>
    <Modale bind:estOuverte={$etatPanneau.menuComparaisonAffiche} titre="Comparer">
      <PanneauComparaison
        bind:sensComparaison
        bind:referentielSelectionne
        bind:langueSelectionnee
        estBureau={false}
        {featureFlagNis2CyFun23}
      />
      {#snippet actions()}
        <dsfr-button
          label="Afficher le tableau"
          kind="primary"
          use:clic={() => ($etatPanneau.menuComparaisonAffiche = false)}
        ></dsfr-button>
        <BoutonReinitialisation bind:langueSelectionnee bind:referentielSelectionne bind:sensComparaison />
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
    <Modale bind:estOuverte={$etatPanneau.menuFiltresAffiche} titre="Filtrer le tableau">
      <PanneauFiltres {source} cible={referentielSelectionne} {estBureau} />
      {#snippet actions()}
        <dsfr-button
          label="Afficher le tableau"
          kind="primary"
          use:clic={() => ($etatPanneau.menuFiltresAffiche = false)}
        ></dsfr-button>
        <BoutonReinitialisation bind:langueSelectionnee bind:referentielSelectionne bind:sensComparaison />
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
      gap: 0;
    }

    p {
      margin: 8px 0 0;
    }
  }
</style>
