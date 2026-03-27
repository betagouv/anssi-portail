<script lang="ts">
  import type { EtatQuestionnaire } from '../../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire';
  import * as api from '../simulateurNi2.api';

  interface Props {
    reponses: EtatQuestionnaire;
  }

  let props: Props = $props();

  $effect(() => {
    api.envoyerReponses(props.reponses);
  });
</script>

<h1>RESULTAT !</h1>

<pre>{JSON.stringify(props.reponses, null, 2)}</pre>

<style lang="scss">
</style>
