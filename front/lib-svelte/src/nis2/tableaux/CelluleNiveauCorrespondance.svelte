<script lang="ts">
  import Badge from '../../ui/Badge.svelte';
  import type { CouleurDeBadge } from '../../ui/badge.type';

  interface Props {
    niveau: string;
  }

  let { niveau }: Props = $props();

  const badgeNiveauxConnus: Record<string, { label: string; accent: CouleurDeBadge }> = {
    moyen: {
      label: 'moyenne',
      accent: 'yellow-tournesol',
    },
    faible: {
      label: 'faible / nulle',
      accent: 'pink-macaron',
    },
    élevé: {
      label: 'élevée',
      accent: 'green-emeraude',
    },
  };

  const proprieteBadge = $derived(
    badgeNiveauxConnus[niveau] ?? {
      label: 'non applicable',
      accent: 'beige-gris-galet',
    }
  );
</script>

<Badge accent={proprieteBadge.accent} libellé={proprieteBadge.label.toUpperCase()} taille="sm" />
