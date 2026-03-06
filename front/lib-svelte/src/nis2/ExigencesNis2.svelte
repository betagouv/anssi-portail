<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { clic } from '../directives/actions.svelte';
  import Modale from '../ui/Modale.svelte';
  import {
    fabriqueDExigence,
    type Correspondance,
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
  import { rechercheParCorrespondance } from './stores/rechercheParCorrespondance';
  import { derived } from 'svelte/store';

  const {
    featureFlagNis2Observations,
  }: { featureFlagNis2Observations: boolean } = $props();

  let exigences = $state<Exigence[]>([]);
  let sensComparaison = $state<'NIS2_VERS_CIBLE' | 'SOURCE_VERS_NIS2'>(
    'NIS2_VERS_CIBLE'
  );
  let mode = $state<'LISTE' | 'COMPARAISON_NIS2_ISO' | 'COMPARAISON_ISO_NIS2'>(
    'LISTE'
  );
  let referentielSelectionne = $state<ReferentielSelectionne | undefined>(
    undefined
  );
  let estBureau = $state(false);
  let menuComparaisonAffiche = $state(false);
  let chargement = $state(false);

  const recupereLesExigences = async ({
    source,
    cible,
  }: { source?: Referentiel; cible?: Referentiel } = {}) => {
    const axiosResponse = await axios.get<Record<string, unknown>[]>(
      '/api/exigences-nis2',
      {
        params: {
          source,
          cible,
        },
      }
    );
    exigences = axiosResponse.data.map((e) =>
      fabriqueDExigence(source ?? 'NIS2', cible, e)
    );
  };
  const optionsCorrespondances = [
    { value: 'NA', label: 'Non Applicable' },
    { value: 'faible', label: 'Faible / Nulle' },
    { value: 'moyen', label: 'Moyenne' },
    { value: 'élevé', label: 'Élevée' },
  ] satisfies { value: Correspondance['niveau']; label: string }[];

  onMount(async () => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });

  const exigencesFiltrees = derived([rechercheParCorrespondance], () => {
    return exigences.filter(rechercheParCorrespondance.ok);
  });

  $effect(() => {
    const charge = async () => {
      chargement = true;
      const source =
        sensComparaison === 'NIS2_VERS_CIBLE' ? 'NIS2' : referentielSelectionne;
      const cible =
        sensComparaison === 'SOURCE_VERS_NIS2'
          ? 'NIS2'
          : referentielSelectionne;
      await recupereLesExigences({ source, cible });

      chargement = false;
      if (!referentielSelectionne) {
        mode = 'LISTE';
      } else {
        mode =
          sensComparaison === 'NIS2_VERS_CIBLE'
            ? 'COMPARAISON_NIS2_ISO'
            : 'COMPARAISON_ISO_NIS2';
      }
    };
    charge();
  });
</script>

<ConteneurLarge mode={mode === 'LISTE' ? 'STANDARD' : 'LARGE'}>
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
        bind:sensComparaison
        bind:referentielSelectionne
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
  </div>
  {#if mode === 'LISTE'}
    <TableauExigencesNIS2Simple
      exigencesNis2={exigences as ExigenceNis2[]}
      {chargement}
    />
  {:else if mode === 'COMPARAISON_NIS2_ISO'}
    <dsfr-select
      label="Correspondance"
      placeholder="Sélectionner une option"
      options={optionsCorrespondances}
      value={$rechercheParCorrespondance}
      onvaluechanged={(e: CustomEvent) =>
        ($rechercheParCorrespondance = e.detail)}
    ></dsfr-select>
    <TableauCorrespondancesExigences
      titreColonneSource="Exigence NIS&nbsp;2"
      titreColonneCible="Référence ISO 27001/27002"
      exigences={$exigencesFiltrees}
      {featureFlagNis2Observations}
      {chargement}
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
    <dsfr-select
      label="Correspondance"
      placeholder="Sélectionner une option"
      options={optionsCorrespondances}
      value={$rechercheParCorrespondance}
      onvaluechanged={(e: CustomEvent) =>
        ($rechercheParCorrespondance = e.detail)}
    ></dsfr-select>
    <TableauCorrespondancesExigences
      titreColonneSource="Référence ISO 27001/27002"
      titreColonneCible="Exigence NIS&nbsp;2"
      exigences={$exigencesFiltrees}
      {featureFlagNis2Observations}
      {chargement}
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

  :global(table.chargement) {
    opacity: 0.25;
  }
</style>
