<script lang="ts">
  import type { CouleurDeBadge } from '../../../../../../ui/badge.type';

  type Props = {
    couleurBadge: CouleurDeBadge;
    href: string;
    labelBadge: string;
    nomIcone: string;
    titre: string;
    description?: string;
  };
  const { href, titre, nomIcone, labelBadge, couleurBadge, description }: Props = $props();
  const src = $derived(`/assets/images/parcours-securisation/outils/${nomIcone}.svg`);
</script>

<div class="outil">
  <dsfr-card
    title={titre}
    size="sm"
    horizontal="true"
    has-description={description ? 'true' : undefined}
    {description}
    {href}
    enlarge="true"
    has-badge="true"
    {src}
    has-header-badge="true"
  >
    <div slot="headerbadges">
      <dsfr-badge label={labelBadge} type="accent" accent={couleurBadge} size="sm"></dsfr-badge>
    </div>
  </dsfr-card>
</div>

<style lang="scss">
  .outil {
    display: flex;
    flex-direction: column;

    dsfr-card {
      min-height: auto;
    }
  }
</style>
