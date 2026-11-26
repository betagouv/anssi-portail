<script lang="ts">
  import type { CouleurDeBadge } from './badge.type';

  type Props = {
    libellé: string;
    taille?: 'sm' | 'md';
    accent?: CouleurDeBadge;
    statut?: 'warning' | 'success' | 'error';
    icone?: string;
  };

  const { libellé, taille = 'md', accent, statut, icone }: Props = $props();

  const type = $derived(statut ? 'status' : 'accent');
  const hasIcon = $derived(icone ? 'true' : undefined);
</script>

<dsfr-badge {type} {accent} size={taille} label={libellé} status={statut} has-icon={hasIcon} icon={icone}>
  <span slot="seo">{libellé}</span>
</dsfr-badge>
