<script lang="ts">
  import Etape from './Etape.svelte';
  import { TitresEtapes } from './TitresEtapes';
  import type {
    TrancheBilanFinancier,
    TrancheChiffreAffaire,
    TrancheNombreEmployes,
  } from '../../../../../back/src/metier/nis2-simulateur/ChampsSimulateur.definitions';
  import PrecedentSuivant from './PrecedentSuivant.svelte';

  function doitDemanderBilanFinancier(
    nombre: TrancheNombreEmployes,
    ca: TrancheChiffreAffaire
  ): boolean {
    if (nombre === 'petit' && (ca === 'moyen' || ca === 'grand')) return true;
    if (nombre === 'moyen' && ca === 'grand') return true;

    return false;
  }

  interface Props {
    onsuivant: (reponse: {
      nombre: TrancheNombreEmployes;
      chiffreAffaire: TrancheChiffreAffaire;
      bilanFinancier?: TrancheBilanFinancier;
    }) => void;
  }

  let props: Props = $props();

  let nombre: TrancheNombreEmployes | undefined = $state();
  let chiffreAffaire: TrancheChiffreAffaire | undefined = $state();
  let bilanFinancier: TrancheBilanFinancier | undefined = $state();

  const choisisNombre = (e: { detail: TrancheNombreEmployes }) => {
    nombre = e.detail;
    bilanFinancier = undefined;
  };
  const choisisChiffreAffaire = (e: { detail: TrancheChiffreAffaire }) => {
    chiffreAffaire = e.detail;
    bilanFinancier = undefined;
  };
  const choisisBilanFinancier = (e: { detail: TrancheBilanFinancier }) => {
    bilanFinancier = e.detail;
  };

  const valide = () => {
    props.onsuivant({
      nombre: nombre!,
      chiffreAffaire: chiffreAffaire!,
      bilanFinancier,
    });
  };
</script>

<Etape>
  <dsfr-stepper
    title={TitresEtapes['tailleEntitePrivee']}
    current-step="4"
    step-count="6"
    hide-details="true"
  ></dsfr-stepper>

  <p>Quelles sont les caractéristiques clés de votre entité</p>

  <dsfr-radios-group
    legend="Nombre d’employés (équivalents temps pleins)"
    radios={[
      { label: '1 à 49', name: 'radios-a', id: 'radio-a-1', value: 'petit' },
      { label: '50 à 249', name: 'radios-a', id: 'radio-a-2', value: 'moyen' },
      { label: '≥ 250', name: 'radios-a', id: 'radio-a-3', value: 'grand' },
    ]}
    onvaluechanged={choisisNombre}
  >
  </dsfr-radios-group>

  <dsfr-radios-group
    legend="Chiffre d’affaires annuel de l'année passée"
    radios={[
      {
        label: '< 10 millions €',
        name: 'radios-b',
        id: 'radio-b-1',
        value: 'petit',
      },
      {
        label: '10 à 50 millions €',
        name: 'radios-b',
        id: 'radio-b-2',
        value: 'moyen',
      },
      {
        label: '≥ 50 millions €',
        name: 'radios-b',
        id: 'radio-b-3',
        value: 'grand',
      },
    ]}
    onvaluechanged={choisisChiffreAffaire}
  ></dsfr-radios-group>

  {#if nombre && chiffreAffaire && doitDemanderBilanFinancier(nombre, chiffreAffaire)}
    <dsfr-radios-group
      value={bilanFinancier}
      legend="Bilan financier annuel de l'année passée"
      radios={[
        {
          label: '< 10 millions €',
          name: 'radios-c',
          id: 'radio-c-1',
          value: 'petit',
        },
        {
          label: '10 à 43 millions €',
          name: 'radios-c',
          id: 'radio-c-2',
          value: 'moyen',
        },
        {
          label: '≥ 43 millions €',
          name: 'radios-c',
          id: 'radio-c-3',
          value: 'grand',
        },
      ]}
      onvaluechanged={choisisBilanFinancier}
    ></dsfr-radios-group>
  {/if}

  <PrecedentSuivant
    message="Sélectionnez une réponse pour chaque critère"
    onsuivant={valide}
    suivantdisabled={nombre === undefined ||
      chiffreAffaire === undefined ||
      (doitDemanderBilanFinancier(nombre, chiffreAffaire) &&
        bilanFinancier === undefined)}
  />
</Etape>
