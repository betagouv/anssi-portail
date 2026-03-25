<script lang="ts">
  import { clic } from '../../directives/actions.svelte';
  import Etape from './Etape.svelte';
  import type { DesignationOperateurServicesEssentiels } from '../../../../../back/src/metier/nis2-simulateur/ChampsSimulateur.definitions';
  import { TitresEtapes } from './TitresEtapes';

  interface Props {
    onsuivant: (reponse: DesignationOperateurServicesEssentiels) => void;
  }

  let props: Props = $props();

  export const options = [
    { label: 'Oui', name: 'radios', id: 'radio-oui', value: 'oui' },
    { label: 'Non', name: 'radios', id: 'radio-non', value: 'non' },
    { label: 'Ne sais pas', name: 'radios', id: 'radio-nsp', value: 'nsp' },
  ];

  let reponse: DesignationOperateurServicesEssentiels | undefined = $state();

  const choisis = (e: { detail: DesignationOperateurServicesEssentiels }) => {
    reponse = e.detail;
  };

  const valide = () => {
    props.onsuivant(reponse!);
  };
</script>

<Etape>
  <dsfr-stepper
    title={TitresEtapes['designationOperateurServicesEssentiels']}
    current-step="1"
    step-count="6"
  ></dsfr-stepper>

  <dsfr-radios-group
    legend="Avez-vous été désigné opérateur de services essentiels (OSE) au titre de NIS 1 ?"
    radios={options}
    onvaluechanged={choisis}
  >
  </dsfr-radios-group>

  <div class="actions">
    <dsfr-button disabled={reponse === undefined} use:clic={valide}>
      Suivant
    </dsfr-button>
  </div>
</Etape>
