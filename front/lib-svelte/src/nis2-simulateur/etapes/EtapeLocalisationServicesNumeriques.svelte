<script lang="ts">
  import Etape from './Etape.svelte';
  import { TitresEtapes } from './TitresEtapes';
  import type { AppartenancePaysUnionEuropeenne } from '../../../../../back/src/metier/nis2-simulateur/ChampsSimulateur.definitions';
  import PrecedentSuivant from './PrecedentSuivant.svelte';

  interface Props {
    onsuivant: (reponse: AppartenancePaysUnionEuropeenne[]) => void;
  }

  let props: Props = $props();
  let reponse: AppartenancePaysUnionEuropeenne[] = $state([]);

  const choisis = (e: { detail: AppartenancePaysUnionEuropeenne[] }) => {
    reponse = e.detail;
  };

  const valide = () => {
    props.onsuivant([...reponse.values()]);
  };
</script>

<Etape>
  <dsfr-stepper
    title={TitresEtapes['localisationFournitureServicesNumeriques']}
    current-step="6"
    step-count="6"
    hide-details="true"
  ></dsfr-stepper>

  <dsfr-checkboxes-group
    legend="Dans quels états membres de l’Union Européenne fournissez-vous des services numériques ?"
    hint="Fournisseur de réseaux de communications électroniques publics, ou Fournisseur de services de communications électroniques accessibles au public."
    checkboxes={[
      { label: 'France', id: 'radio-fr', value: 'france' },
      {
        label: "Autres états membres de l'Union Européenne",
        id: 'radio-autre',
        value: 'autre',
      },
      {
        label: 'Autres états hors Union Européenne',
        id: 'radio-horsue',
        value: 'horsue',
      },
    ]}
    onvalueschanged={choisis}
  ></dsfr-checkboxes-group>

  <PrecedentSuivant
    message="Sélectionnez au moins une réponse"
    onsuivant={valide}
    suivantdisabled={reponse.length === 0}
  />
</Etape>
