<script lang="ts">
  import { DsfrBadge, DsfrCard } from '@lab-anssi/ui-kit';
  import type { CouleurDeBadge } from '../../../../../../ui/badge.type';
  import IllustrationOutil from './IllustrationOutil.svelte';

  type Props = {
    couleurBadge: CouleurDeBadge;
    description?: string;
    href: string;
    labelBadge: string;
    nomIcone: string;
    titre: string;
    vertical?: boolean;
  };
  const { couleurBadge, description, href, labelBadge, nomIcone, titre, vertical = false }: Props = $props();
  const src = $derived(`/assets/images/parcours-securisation/outils/${nomIcone}-logo.svg`);
</script>

<div class="outil">
  <DsfrCard
    blank
    {description}
    enlarge
    hasDescription={Boolean(description)}
    hasHeaderBadge
    {href}
    horizontal={!vertical}
    size="sm"
    title={titre}
  >
    <div slot="headerbadges" class="fr-badges-group">
      <DsfrBadge label={labelBadge} type="accent" accent={couleurBadge} size="sm"></DsfrBadge>
    </div>
    <div slot="image" class="image-outil">
      <IllustrationOutil illustration={src} />
    </div>
  </DsfrCard>
</div>

<style lang="scss">
  .image-outil {
    height: 100%;
  }

  .outil {
    display: flex;
    flex-direction: column;
    height: 100%;

    :global(> .fr-card) {
      flex: 1;
    }
  }
</style>
