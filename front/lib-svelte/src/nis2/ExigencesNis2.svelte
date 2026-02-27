<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { ExigenceNis2, ReferentielSelectionne } from './exigence.type';
  import TableauExigencesNIS2Simple from './tableaux/TableauExigencesNIS2Simple.svelte';
  import PanneauComparaison from './PanneauComparaison.svelte';
  import { clic } from '../directives/actions.svelte';
  import Modale from '../ui/Modale.svelte';
  import TableauCorrespondancesExigences from './tableaux/TableauCorrespondancesExigences.svelte';

  let exigencesNis2 = $state<ExigenceNis2[]>([]);

  let sensComparaison = $state<'NIS2_VERS_CIBLE' | 'SOURCE_VERS_NIS2'>(
    'NIS2_VERS_CIBLE'
  );
  let mode = $state<'COMPARAISON' | 'LISTE'>('LISTE');

  let referentielSelectionne = $state<ReferentielSelectionne>('');

  let estBureau = $state(false);

  const reinitialise = () => {
    referentielSelectionne = '';
    mode = 'LISTE';
    sensComparaison = 'NIS2_VERS_CIBLE';
  };

  let menuComparaisonAffiche = $state(false);

  onMount(async () => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;

    const axiosResponse = await axios.get<ExigenceNis2[]>(
      '/api/exigences-nis2'
    );
    exigencesNis2 = axiosResponse.data;
  });
</script>

<dsfr-container>
  {#if !estBureau}
    <dsfr-alert type="info" size="sm" hasTitle={false} dismissible>
      <span slot="description">
        Cette page n’est pas optimisée pour un affichage mobile.
      </span>
    </dsfr-alert>
  {/if}
  <div class="entete">
    <h2>Liste des exigences NIS 2</h2>
    {#if estBureau}
      <PanneauComparaison
        bind:mode
        bind:sensComparaison
        bind:referentielSelectionne
        {reinitialise}
        estBureau={true}
      />
    {:else}
      <div class="comparaison-libelle">
        <p class="texte-standard-md">Comparer les exigences NIS 2</p>
        <p class="texte-mention-xs">
          Comparez les exigences NIS 2 avec des référentiels déjà en place au
          sein de votre organisation.
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
          bind:mode
          bind:sensComparaison
          bind:referentielSelectionne
          {reinitialise}
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
  </div>
  {#if mode === 'LISTE'}
    <TableauExigencesNIS2Simple {exigencesNis2} />
  {:else}
    <TableauCorrespondancesExigences {exigencesNis2} />
  {/if}
  <dsfr-link
    label="Haut de page"
    href="#"
    size="md"
    has-icon
    icon="arrow-up-fill"
  ></dsfr-link>
</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-bottom: 4.5rem;

    dsfr-alert {
      margin-bottom: 1.5rem;
    }

    .entete {
      margin: 0 0 24px;
      padding: 0 0 16px;
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
