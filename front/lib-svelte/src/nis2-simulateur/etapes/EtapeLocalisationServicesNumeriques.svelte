<script lang="ts">
  import { DsfrCheckboxesGroup } from '@lab-anssi/ui-kit';

  import type { AppartenancePaysUnionEuropeenne } from '../../../../../back/src/metier/nis2-simulateur/ChampsSimulateur.definitions';
  import Etape from './Etape.svelte';
  import PrecedentSuivant from './PrecedentSuivant.svelte';
  import { TitresEtapes } from './TitresEtapes';

  interface Props {
    onsuivant: (reponse: AppartenancePaysUnionEuropeenne[]) => void;
  }

  let { onsuivant }: Props = $props();
  let reponse: AppartenancePaysUnionEuropeenne[] = $state([]);

  const choisis = (appartenances: string[]) => {
    reponse = appartenances as AppartenancePaysUnionEuropeenne[];
  };

  const valide = () => {
    onsuivant([...reponse.values()]);
  };
  const id = $props.id();
</script>

<Etape>
  <dsfr-stepper
    title={TitresEtapes['localisationFournitureServicesNumeriques']}
    current-step="6"
    step-count="6"
    hide-details="true"
  ></dsfr-stepper>

  <DsfrCheckboxesGroup
    {id}
    legend="Dans quels États membres de l’Union européenne fournissez-vous des services numériques&#8239;?"
    hint="Fournisseur de réseaux de communications électroniques publics, ou Fournisseur de services de communications électroniques accessibles au public."
    checkboxes={[
      { label: 'France', id: 'radio-fr', value: 'france' },
      {
        label: "Autres États membres de l'Union européenne",
        id: 'radio-autre',
        value: 'autre',
      },
      {
        label: 'Autres États hors Union européenne',
        id: 'radio-horsue',
        value: 'horsue',
      },
    ]}
    onvalueschanged={choisis}
  ></DsfrCheckboxesGroup>

  <PrecedentSuivant
    message="Sélectionnez au moins une réponse"
    onsuivant={valide}
    suivantdisabled={reponse.length === 0}
  />
</Etape>
