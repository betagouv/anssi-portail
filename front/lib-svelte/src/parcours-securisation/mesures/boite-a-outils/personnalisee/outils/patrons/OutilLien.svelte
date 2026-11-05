<script lang="ts">
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
  <dsfr-card
    blank
    {description}
    enlarge="true"
    has-badge="true"
    has-description={description ? 'true' : undefined}
    has-header-badge="true"
    {href}
    horizontal={!vertical}
    size="sm"
    title={titre}
  >
    <div slot="headerbadges">
      <dsfr-badge label={labelBadge} type="accent" accent={couleurBadge} size="sm"></dsfr-badge>
    </div>
    <div slot="image" class="image-outil">
      <IllustrationOutil illustration={src} />
    </div>
  </dsfr-card>
</div>

<style lang="scss">
  .image-outil {
    height: 100%;
  }

  .outil {
    display: flex;
    flex-direction: column;
    height: 100%;

    dsfr-card {
      min-height: auto;
      flex: 1;
    }
  }
</style>
