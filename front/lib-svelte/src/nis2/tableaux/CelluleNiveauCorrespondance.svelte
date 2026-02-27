<script lang="ts">
  export let niveau: string;

  const badgeNiveauxConnus: Record<string, { label: string; accent: string }> =
    {
      O: {
        label: 'moyenne',
        accent: 'yellow-tournesol',
      },
      R: {
        label: 'faible/nulle',
        accent: 'pink-macaron',
      },
      V: {
        label: 'élevée',
        accent: 'green-emeraude',
      },
    };

  const proprieteBadge = badgeNiveauxConnus[niveau] ?? {
    label: 'non applicable',
    accent: 'beige-gris-galet',
  };
</script>

<td>
  <dsfr-badge
    accent={proprieteBadge.accent}
    label={proprieteBadge.label.toUpperCase()}
    size="sm"
    type="accent"
  ></dsfr-badge>
</td>

<style lang="scss">
  td {
    padding: 0.5rem 1rem;
    border: 1px solid black;
  }
</style>
