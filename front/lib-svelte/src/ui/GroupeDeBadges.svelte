<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import type { CouleurDeBadge } from './badge.type';

  type Props = {
    badges: { label: string; accent: CouleurDeBadge }[];
    taille?: 'sm' | 'md';
  };
  const { badges, taille = 'sm' }: Props = $props();
</script>

<dsfr-badges-group badges={enPropriétéWebC(badges)} size={taille}>
  <ul slot="seo">
    {#each badges as badge (badge)}
      <li>{badge.label}</li>
    {/each}
  </ul>
</dsfr-badges-group>
