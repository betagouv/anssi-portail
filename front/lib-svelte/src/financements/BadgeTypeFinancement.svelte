<script lang="ts">
  type Props = {
    type: string;
  };
  const { type }: Props = $props();
</script>

<dsfr-badge type="accent" accent="yellow-tournesol" size="sm" label={type}></dsfr-badge>
