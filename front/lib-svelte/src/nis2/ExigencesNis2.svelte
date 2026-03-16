<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import ConteneurLarge from '../ui/ConteneurLarge.svelte';
  import {
    fabriqueDExigence,
    type Exigence,
    type ExigenceNis2,
    type Referentiel,
    type ReferentielSelectionne,
  } from './exigence.type';
  import Panneau from './panneau/Panneau.svelte';
  import { exigencesStore } from './stores/exigences.store';
  import { exigencesFiltrees } from './stores/exigencesFiltrees.store';
  import TableauCorrespondancesExigences from './tableaux/TableauCorrespondancesExigences.svelte';
  import TableauExigencesNIS2Simple from './tableaux/TableauExigencesNIS2Simple.svelte';
  import type { Comparaison } from './tableaux/configuration.type';
  import Avertissements from './Avertissements.svelte';

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
    <h2>Liste des exigences NIS 2</h2>
    <p class="texte-detail-sm">
      Téléchargez la liste au format PDF sur le
      <dsfr-link
        href="https://cyber.gouv.fr/reglementation/cybersecurite-systemes-dinformation/directives-nis-nis2-et-dispositif-saiv/directive-nis-2/"
        label="site de l'ANSSI"
        blank
      ></dsfr-link>
    </p>
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
    <TableauExigencesNIS2Simple
      exigencesNis2={$exigencesFiltrees.exigences as ExigenceNis2[]}
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
  h2 {
    margin-bottom: 8px;
  }

  .entete {
    margin: 0 0 24px;
    padding: 0 0 16px;
  }

  :global(table.chargement) {
    opacity: 0.25;
  }
</style>
