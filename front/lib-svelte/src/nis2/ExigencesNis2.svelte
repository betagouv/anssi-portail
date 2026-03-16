<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import ConteneurLarge from '../ui/ConteneurLarge.svelte';
  import Avertissements from './Avertissements.svelte';
  import {
    type Exigence,
    fabriqueDExigence,
    type ReferentielSelectionne,
  } from './exigence.type';
  import Panneau from './panneau/Panneau.svelte';
  import { exigencesStore } from './stores/exigences.store';
  import { exigencesFiltrees } from './stores/exigencesFiltrees.store';
  import type { Comparaison } from './tableaux/configuration.type';
  import TableauCorrespondancesExigences from './tableaux/TableauCorrespondancesExigences.svelte';
  import TableauExigencesSimple from './tableaux/TableauExigencesSimple.svelte';

  const {
    featureFlagNis2CyFun23,
    featureFlagNis2Observations,
  }: { featureFlagNis2Observations: boolean; featureFlagNis2CyFun23: boolean } =
    $props();

  let exigences = $state<Exigence[]>([]);
  let sensComparaison = $state<'NIS2_VERS_CIBLE' | 'SOURCE_VERS_NIS2'>(
    'NIS2_VERS_CIBLE'
  );

  let mode = $state<'LISTE' | Comparaison>('LISTE');

  let referentielSelectionne = $state<ReferentielSelectionne | undefined>(
    undefined
  );
  let estBureau = $state(false);
  let chargement = $state(false);

  const recupereLesExigences = async () => {
    const axiosResponse = await axios.get<Record<string, unknown>[]>(
      '/api/exigences-nis2',
      {
        params: { source, cible },
      }
    );
    exigences = axiosResponse.data.map((e) =>
      fabriqueDExigence(source ?? 'NIS2', cible, e)
    );
    $exigencesStore = exigences;
  };

  onMount(async () => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });

  const source = $derived(
    sensComparaison === 'NIS2_VERS_CIBLE' ? 'NIS2' : referentielSelectionne
  );

  const cible = $derived(
    sensComparaison === 'SOURCE_VERS_NIS2' ? 'NIS2' : referentielSelectionne
  );

  const lienExportTableau = $derived(
    `/api/exigences-nis2.csv?${new URLSearchParams({
      ...(source && { source }),
      ...(cible && { cible }),
    }).toString()}`
  );

  $effect(() => {
    const charge = async () => {
      chargement = true;
      await recupereLesExigences();

      chargement = false;
      if (!referentielSelectionne) {
        mode = 'LISTE';
      } else {
        mode =
          sensComparaison === 'NIS2_VERS_CIBLE'
            ? `COMPARAISON_NIS2_${referentielSelectionne}`
            : `COMPARAISON_${referentielSelectionne}_NIS2`;
      }
    };
    charge();
  });
</script>

<ConteneurLarge mode={mode === 'LISTE' ? 'STANDARD' : 'LARGE'}>
  <Avertissements {estBureau} />
  <div class="entete">
    <div class="titre">
      <h2>Exigences applicables à NIS&nbsp;2</h2>
      <dsfr-link
        href="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/20260317_NIS_V2_ReCyF_v2.5.pdf"
        label="Télécharger les exigences (PDF)"
        blank
        download
      ></dsfr-link>
      <dsfr-button
        label="Exporter le tableau"
        markup="a"
        href={lienExportTableau}
        has-icon
        icon-place="left"
        icon="download-line"
        centered
      ></dsfr-button>
    </div>

    <Panneau
      source={sensComparaison === 'NIS2_VERS_CIBLE'
        ? 'NIS2'
        : (referentielSelectionne ?? 'NIS2')}
      bind:referentielSelectionne
      bind:sensComparaison
      {estBureau}
      {featureFlagNis2CyFun23}
    />
  </div>
  {#if mode === 'LISTE'}
    <TableauExigencesSimple
      exigences={$exigencesFiltrees.exigences}
      {chargement}
    />
  {:else}
    <TableauCorrespondancesExigences
      {chargement}
      {featureFlagNis2Observations}
      exigences={$exigencesFiltrees.exigences}
      comparaison={mode}
    />
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
  @use '../../../assets/styles/responsive' as *;

  h2 {
    margin-bottom: 0;
  }

  .entete {
    margin: 0 0 24px;
    padding: 0 0 16px;

    .titre {
      display: grid;
      grid-template-areas: 'titre' 'telechargement' 'export';
      margin-bottom: 1rem;

      @include a-partir-de(md) {
        grid-template-areas: 'titre export' 'telechargement telechargement';
        grid-template-columns: auto auto;
        row-gap: 8px;
        margin-bottom: 0;
      }
      h2 {
        grid-area: titre;
      }

      dsfr-link {
        grid-area: telechargement;
      }

      dsfr-button {
        grid-area: export;
        @include a-partir-de(md) {
          width: fit-content;
          justify-self: end;
        }
      }
    }
  }
</style>
