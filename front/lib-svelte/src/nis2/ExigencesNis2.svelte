<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { clic } from '../directives/actions.svelte';
  import Modale from '../ui/Modale.svelte';
  import {
    recupereCorrespondance,
    type Exigence,
    type ExigenceISO,
    type ExigenceNis2,
    type Referentiel,
    type ReferentielSelectionne,
  } from './exigence.type';
  import PanneauComparaison from './PanneauComparaison.svelte';
  import CelluleExigenceISO from './tableaux/CelluleExigenceISO.svelte';
  import CelluleExigenceNis2 from './tableaux/CelluleExigenceNis2.svelte';
  import CelluleExigencesISOCibles from './tableaux/CelluleExigencesISOCibles.svelte';
  import CelluleExigencesNIS2Cibles from './tableaux/CelluleExigencesNIS2Cibles.svelte';
  import TableauCorrespondancesExigences from './tableaux/TableauCorrespondancesExigences.svelte';
  import TableauExigencesNIS2Simple from './tableaux/TableauExigencesNIS2Simple.svelte';
  import ConteneurLarge from '../ui/ConteneurLarge.svelte';

  let exigences = $state<Exigence[]>([]);

  let sensComparaison = $state<'NIS2_VERS_CIBLE' | 'SOURCE_VERS_NIS2'>(
    'NIS2_VERS_CIBLE'
  );
  let mode = $state<'COMPARAISON' | 'LISTE'>('LISTE');

  let referentielSelectionne = $state<ReferentielSelectionne>('');
  $effect(() => {
    const charge = async () => {
      if (mode === 'LISTE') {
        await recupereLesExigences();
      } else {
        const source =
          sensComparaison === 'NIS2_VERS_CIBLE'
            ? 'NIS2'
            : referentielSelectionne;
        const cible =
          sensComparaison === 'SOURCE_VERS_NIS2'
            ? 'NIS2'
            : referentielSelectionne;
        await recupereLesExigences({ source, cible });
      }
    };
    charge();
  });

  let estBureau = $state(false);

  const reinitialise = async () => {
    referentielSelectionne = '';
    mode = 'LISTE';
    sensComparaison = 'NIS2_VERS_CIBLE';
    await recupereLesExigences();
  };

  let menuComparaisonAffiche = $state(false);

  const recupereLesExigences = async ({
    source,
    cible,
  }: { source?: Referentiel; cible?: Referentiel } = {}) => {
    const axiosResponse = await axios.get<Exigence[]>('/api/exigences-nis2', {
      params: {
        source,
        cible,
      },
    });
    exigences = axiosResponse.data;
  };

  onMount(async () => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });
</script>

<ConteneurLarge mode={mode === 'COMPARAISON' ? 'LARGE' : 'STANDARD'}>
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
    <TableauExigencesNIS2Simple exigencesNis2={exigences as ExigenceNis2[]} />
  {:else if sensComparaison === 'NIS2_VERS_CIBLE'}
    <TableauCorrespondancesExigences
      titreColonneSource="Exigence NIS&nbsp;2"
      titreColonneCible="Référence ISO 27001/27002"
      {exigences}
      {recupereCorrespondance}
    >
      {#snippet colonneSource(exigenceSource)}
        {@const e = exigenceSource as ExigenceNis2}
        <CelluleExigenceNis2 exigence={e} />
      {/snippet}
      {#snippet colonneCible(exigencesCibles)}
        <CelluleExigencesISOCibles exigences={exigencesCibles} />
      {/snippet}
    </TableauCorrespondancesExigences>
  {:else}
    <TableauCorrespondancesExigences
      titreColonneSource="Référence ISO 27001/27002"
      titreColonneCible="Exigence NIS&nbsp;2"
      {exigences}
      {recupereCorrespondance}
    >
      {#snippet colonneSource(exigenceSource)}
        {@const e = exigenceSource as ExigenceISO}
        <CelluleExigenceISO exigence={e} />
      {/snippet}
      {#snippet colonneCible(exigences)}
        <CelluleExigencesNIS2Cibles {exigences} />
      {/snippet}
    </TableauCorrespondancesExigences>
  {/if}
  <dsfr-link
    label="Haut de page"
    href="#"
    size="md"
    has-icon
    icon="arrow-up-fill"
  ></dsfr-link>
</ConteneurLarge>

<style lang="scss">
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
</style>
