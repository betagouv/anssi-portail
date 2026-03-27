<script lang="ts">
  import Etape from './Etape.svelte';
  import { TitresEtapes } from './TitresEtapes';
  import type { AppartenancePaysUnionEuropeenne } from '../../../../../back/src/metier/nis2-simulateur/ChampsSimulateur.definitions';
  import PrecedentSuivant from './PrecedentSuivant.svelte';
  import {
    optionAutre,
    optionFrance,
    optionHorsUe,
    reponseEstComplete,
  } from './EtapeLocalisationEtablissementPrincipal';

  interface Props {
    onsuivant: (reponse: {
      paysDecision: AppartenancePaysUnionEuropeenne;
      paysOperation?: AppartenancePaysUnionEuropeenne;
      paysSalaries?: AppartenancePaysUnionEuropeenne;
    }) => void;
  }

  let props: Props = $props();

  let paysDecision: AppartenancePaysUnionEuropeenne | undefined = $state();
  let paysOperation: AppartenancePaysUnionEuropeenne | undefined = $state();
  let paysSalaries: AppartenancePaysUnionEuropeenne | undefined = $state();

  const paysDecisionEstHorsUE = $derived(paysDecision?.includes('horsue'));
  const paysOperationEstHorsUE = $derived(paysOperation?.includes('horsue'));

  const choisisDecision = (e: { detail: AppartenancePaysUnionEuropeenne }) => {
    paysDecision = e.detail;
    paysOperation = undefined;
    paysSalaries = undefined;
  };
  const choisisOperation = (e: { detail: AppartenancePaysUnionEuropeenne }) => {
    paysOperation = e.detail;
    paysSalaries = undefined;
  };
  const choisisSalaries = (e: { detail: AppartenancePaysUnionEuropeenne }) => {
    paysSalaries = e.detail;
  };

  const valide = () => {
    props.onsuivant({
      paysDecision: paysDecision!,
      paysOperation,
      paysSalaries,
    });
  };
</script>

<Etape>
  <dsfr-stepper
    title={TitresEtapes['localisationEtablissementPrincipal']}
    current-step="6"
    step-count="6"
    hide-details="true"
  ></dsfr-stepper>

  <dsfr-radios-group
    value={paysDecision}
    legend="Dans quel pays sont principalement prises les décisions relatives aux mesures de gestion des risques en matière de cybersécurité ?"
    radios={[
      optionFrance('pays-decision'),
      optionAutre('pays-decision'),
      optionHorsUe('pays-decision'),
    ]}
    onvaluechanged={choisisDecision}
  ></dsfr-radios-group>

  {#if paysDecisionEstHorsUE}
    <dsfr-radios-group
      value={paysOperation}
      legend="Dans quel pays les opérations de cybersécurité sont-elles effectuées ?"
      radios={[
        optionFrance('pays-operation'),
        optionAutre('pays-operation'),
        optionHorsUe('pays-operation'),
      ]}
      onvaluechanged={choisisOperation}
    ></dsfr-radios-group>
  {/if}

  {#if paysOperationEstHorsUE}
    <dsfr-radios-group
      value={paysSalaries}
      legend="Dans quel pays votre entité possède-t-elle l’établissement comptant le plus grand nombre de salariés dans l’Union Européenne ?"
      radios={[optionFrance('pays-autre'), optionAutre('pays-autre')]}
      onvaluechanged={choisisSalaries}
    ></dsfr-radios-group>
  {/if}

  <PrecedentSuivant
    message="Sélectionnez au moins une réponse"
    onsuivant={valide}
    suivantdisabled={!reponseEstComplete({
      paysDecision,
      paysOperation,
      paysSalaries,
    })}
  />
</Etape>
