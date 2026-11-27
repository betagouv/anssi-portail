<script lang="ts">
  import { DsfrBadgesGroup } from '@lab-anssi/ui-kit';

  import type { Badge } from './badge.type';

  type Props = {
    badges: Badge[];
    taille?: 'sm' | 'md';
  };
  const { badges, taille = 'sm' }: Props = $props();
</script>

<DsfrBadgesGroup {badges} size={taille}></DsfrBadgesGroup>
