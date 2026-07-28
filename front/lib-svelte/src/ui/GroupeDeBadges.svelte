<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import type { Badge } from './badge.type';

  type Props = {
    badges: Badge[];
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
