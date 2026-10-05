<script lang="ts">
  import { onMount } from 'svelte';
  import { récupèreStatistiquesMSC, type Statistiques } from '../passerelles/statistiquesMSC';

  let statistiques: Statistiques | undefined = $state();

  onMount(async () => {
    statistiques = await récupèreStatistiquesMSC();
  });
</script>

<dsfr-badge
  type="accent"
  accent="green-bourgeon"
  label={`+${statistiques?.diagnosticsCyberArrondis ?? 0} organisations accompagnées 🚀`}
  size="sm"
></dsfr-badge>
