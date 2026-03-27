<script lang="ts">
  import type { EtatQuestionnaire } from '../../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire';

  interface Props {
    reponses: EtatQuestionnaire;
  }

  let props: Props = $props();
</script>

<h1>RESULTAT !</h1>

<pre>{JSON.stringify(props.reponses, null, 2)}</pre>

<style lang="scss">
</style>
