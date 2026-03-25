<script lang="ts">
  import Etape from './Etape.svelte';
  import { clic } from '../../directives/actions.svelte';
  import { TitresEtapes } from './TitresEtapes';
  import type { AppartenancePaysUnionEuropeenne } from '../../../../../back/src/metier/nis2-simulateur/ChampsSimulateur.definitions';

  interface Props {
    onsuivant: (reponse: AppartenancePaysUnionEuropeenne) => void;
  }

  let props: Props = $props();

  let reponse: AppartenancePaysUnionEuropeenne | undefined = $state();

  const options = [
    { label: 'France', name: 'radios', id: 'radio-fr', value: 'france' },
    {
      label: "Autres états membres de l'Union Européenne",
      name: 'radios',
      id: 'radio-autre',
      value: 'autre',
      disabled: true,
    },
    {
      label: 'Autres états hors Union Européenne',
      name: 'radios',
      id: 'radio-horsue',
      value: 'horsue',
      disabled: true,
    },
  ];

  const choisis = (e: { detail: AppartenancePaysUnionEuropeenne }) => {
    reponse = e.detail;
  };

  const valide = () => {
    props.onsuivant(reponse!);
  };
</script>

<Etape>
  <dsfr-stepper
    title={TitresEtapes['appartenanceUnionEuropeenne']}
    current-step="2"
    step-count="6"
  ></dsfr-stepper>

  <dsfr-radios-group
    legend="Dans quel état membre de l’Union Européenne êtes-vous établi ?"
    hint="Pour votre entreprise filiale si celle-ci fait partie d’un groupe,
            ou pour le groupe si celui-ci mène une activité économique.
            Ce sujet pourra être précisé par la Commission Européenne."
    radios={options}
    onvaluechanged={choisis}
  ></dsfr-radios-group>

  <dsfr-highlight
    text="Le test est dans un premier temps focalisé sur les entités établies en France, il sera par la suite disponible pour les entités établies dans les autres États de l'Union Européenne et dans les États hors Union Européenne."
  ></dsfr-highlight>

  <div class="actions">
    <dsfr-button disabled={reponse === undefined} use:clic={valide}>
      Suivant
    </dsfr-button>
  </div>
</Etape>
