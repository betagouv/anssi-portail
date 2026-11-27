<script lang="ts">
  import Badge from '../ui/Badge.svelte';

  type Props = {
    type: string;
  };
  const { type }: Props = $props();
</script>

<Badge accent="yellow-tournesol" libellé={type} taille="sm" />
