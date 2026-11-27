<script lang="ts">
  import { onMount } from 'svelte';

  import { récupèreStatistiquesMSC, type Statistiques } from '@passerelles/statistiquesMSC';
  import Badge from '@ui/Badge.svelte';

  let statistiques: Statistiques | undefined = $state();

  onMount(async () => {
    statistiques = await récupèreStatistiquesMSC();
  });
</script>

<Badge
  libellé={`+${statistiques?.démarchesDeSécurisationArrondies ?? 0} organisations accompagnées 🚀`}
  accent="green-bourgeon"
  taille="sm"
/>
