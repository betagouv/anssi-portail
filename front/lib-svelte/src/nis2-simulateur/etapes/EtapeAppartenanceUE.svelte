<script lang="ts">
  import type { AppartenancePaysUnionEuropeenne } from '../../../../../back/src/metier/nis2-simulateur/ChampsSimulateur.definitions';
  import Etape from './Etape.svelte';
  import PrecedentSuivant from './PrecedentSuivant.svelte';
  import { TitresEtapes } from './TitresEtapes';

  interface Props {
    onsuivant: (reponse: AppartenancePaysUnionEuropeenne) => void;
  }

  let { onsuivant }: Props = $props();

  let reponse: AppartenancePaysUnionEuropeenne | undefined = $state();

  const choisis = (e: { detail: AppartenancePaysUnionEuropeenne }) => {
    reponse = e.detail;
  };

  const valide = () => {
    onsuivant(reponse!);
  };
</script>

<Etape>
  <dsfr-stepper title={TitresEtapes['appartenanceUnionEuropeenne']} current-step="2" step-count="6" hide-details="true"
  ></dsfr-stepper>

  <dsfr-radios-group
    legend="Dans quel État membre de l’Union européenne êtes-vous établi&#8239;?"
    hint="Pour votre entreprise filiale si celle-ci fait partie d’un groupe,
            ou pour le groupe si celui-ci mène une activité économique.
            Ce sujet pourra être précisé par la Commission européenne."
    radios={[
      { label: 'France', name: 'radios', id: 'radio-fr', value: 'france' },
      {
        label: "Autres États membres de l'Union européenne",
        name: 'radios',
        id: 'radio-autre',
        value: 'autre',
        disabled: true,
      },
      {
        label: 'Autres États hors Union européenne',
        name: 'radios',
        id: 'radio-horsue',
        value: 'horsue',
        disabled: true,
      },
    ]}
    onvaluechanged={choisis}
  ></dsfr-radios-group>

  <dsfr-highlight
    text="Le test est dans un premier temps focalisé sur les entités établies en France, il sera par la suite disponible pour les entités établies dans les autres États de l'Union européenne et dans les États hors Union européenne."
  ></dsfr-highlight>

  <PrecedentSuivant message="Sélectionnez une réponse" onsuivant={valide} suivantdisabled={reponse === undefined} />
</Etape>
