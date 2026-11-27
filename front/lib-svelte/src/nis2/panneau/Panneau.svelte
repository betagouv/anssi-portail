<script lang="ts">
  import Bouton from '@ui/Bouton.svelte';
  import Modale from '@ui/Modale.svelte';

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
  };

  let {
    estBureau,
    source,
    sensComparaison = $bindable(),
    referentielSelectionne = $bindable(),
    langueSelectionnee = $bindable('FR'),
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
    <PanneauComparaison bind:sensComparaison bind:referentielSelectionne estBureau={true} bind:langueSelectionnee />
    {#if explications}
      <p class="texte-detail-sm">{explications}</p>
    {/if}
    <PanneauFiltres {source} cible={referentielSelectionne} {estBureau} />
  {:else}
    <Bouton
      libelle="Comparer ReCyF (NIS 2)"
      icone="arrow-left-right-line"
      type="secondaire"
      surClic={() => ($etatPanneau.menuComparaisonAffiche = true)}
    />
    <Modale bind:estOuverte={$etatPanneau.menuComparaisonAffiche} titre="Comparer">
      <PanneauComparaison bind:sensComparaison bind:referentielSelectionne bind:langueSelectionnee estBureau={false} />
      {#snippet actions()}
        <Bouton
          libelle="Afficher le tableau"
          type="primaire"
          surClic={() => ($etatPanneau.menuComparaisonAffiche = false)}
        />
        <BoutonReinitialisation bind:langueSelectionnee bind:referentielSelectionne bind:sensComparaison />
      {/snippet}
    </Modale>

    <Bouton
      libelle="Filtrer le tableau"
      icone="filter-line"
      type="secondaire"
      surClic={() => ($etatPanneau.menuFiltresAffiche = true)}
    />
    <Modale bind:estOuverte={$etatPanneau.menuFiltresAffiche} titre="Filtrer le tableau">
      <PanneauFiltres {source} cible={referentielSelectionne} {estBureau} />
      {#snippet actions()}
        <Bouton
          libelle="Afficher le tableau"
          type="primaire"
          surClic={() => ($etatPanneau.menuFiltresAffiche = false)}
        />
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
