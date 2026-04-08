<script lang="ts">
  import Etape from './Etape.svelte';
  import { TitresEtapes } from './TitresEtapes';
  import type { TypeStructure } from '../../../../../back/src/metier/nis2-simulateur/ChampsSimulateur.definitions';
  import PrecedentSuivant from './PrecedentSuivant.svelte';

  interface Props {
    onsuivant: (reponse: TypeStructure) => void;
  }

  let props: Props = $props();

  let reponse: TypeStructure | undefined = $state();

  const options = [
    {
      label: 'Entreprise privée ou publique',
      name: 'radios',
      id: 'radio-1',
      value: 'privee',
    },
    {
      label: 'Administration publique',
      name: 'radios',
      id: 'radio-2',
      value: 'publique',
      disabled: true,
    },
  ];

  const choisis = (e: { detail: TypeStructure }) => {
    reponse = e.detail;
  };

  const valide = () => {
    props.onsuivant(reponse!);
  };
</script>

<Etape>
  <dsfr-stepper title={TitresEtapes['typeStructure']} current-step="3" step-count="6" hide-details="true"
  ></dsfr-stepper>

  <dsfr-radios-group legend="Quel type de structure qualifie votre entité ?" radios={options} onvaluechanged={choisis}
  ></dsfr-radios-group>

  <dsfr-highlight
    text="Le test est dans un premier temps focalisé sur les entreprises
            privées ou publiques. Il sera par la suite disponible pour les
            administrations publiques."
  ></dsfr-highlight>

  <PrecedentSuivant message="Sélectionnez une réponse" onsuivant={valide} suivantdisabled={reponse === undefined} />
</Etape>
