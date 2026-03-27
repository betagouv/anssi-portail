<script lang="ts">
  import type { EtatQuestionnaire } from '../../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire';
  import * as api from '../simulateurNi2.api';
  import TamponResultat from './TamponResultat.svelte';
  import { evalueEligibilite } from '../../../../../back/src/metier/nis2-simulateur/questionnaire/evalueEligibilite';
  import SpecificationsCompletes from '../../../../../back/src/metier/nis2-simulateur/questionnaire/specifications-completes.csv?raw';
  import PointsAttention from './PointsAttention.svelte';

  interface Props {
    reponses: EtatQuestionnaire;
  }

  let props: Props = $props();

  $effect(() => {
    api.envoyerReponses(props.reponses);
  });

  let { resultat } = $derived.by(() =>
    evalueEligibilite(props.reponses, SpecificationsCompletes)
  );
</script>

<div class="resultat">
  <TamponResultat {resultat} />

  <PointsAttention
    resumes={resultat.pointsAttention.resumes}
    precisions={resultat.pointsAttention.precisions}
  />
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille' as *;

  .resultat {
    box-sizing: border-box;
    padding: 40px taille-pour-colonnes(1);
    margin: 40px auto;
    display: flex;
    flex-direction: column;
    gap: 8px;

    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(8);
    }
  }
</style>
