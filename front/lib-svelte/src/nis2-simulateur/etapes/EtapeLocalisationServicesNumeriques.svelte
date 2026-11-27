<script lang="ts">
  import GroupeDeCasesACocher from '@ui/GroupeDeCasesACocher.svelte';

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

  <GroupeDeCasesACocher
    {id}
    légende="Dans quels États membres de l’Union européenne fournissez-vous des services numériques&#8239;?"
    astuce="Fournisseur de réseaux de communications électroniques publics, ou Fournisseur de services de communications électroniques accessibles au public."
    casesÀCocher={[
      { libellé: 'France', id: 'radio-fr', valeur: 'france' },
      {
        libellé: "Autres États membres de l'Union européenne",
        id: 'radio-autre',
        valeur: 'autre',
      },
      {
        libellé: 'Autres États hors Union européenne',
        id: 'radio-horsue',
        valeur: 'horsue',
      },
    ]}
    surChangement={choisis}
  ></GroupeDeCasesACocher>

  <PrecedentSuivant
    message="Sélectionnez au moins une réponse"
    onsuivant={valide}
    suivantdisabled={reponse.length === 0}
  />
</Etape>
