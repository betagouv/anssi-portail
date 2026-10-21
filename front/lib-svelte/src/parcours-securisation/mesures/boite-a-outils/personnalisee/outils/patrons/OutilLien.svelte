<script lang="ts">
  import type { CouleurDeBadge } from '../../../../../../ui/badge.type';

  type Props = {
    couleurBadge: CouleurDeBadge;
    description?: string;
    href: string;
    labelBadge: string;
    nomIcone: string;
    titre: string;
  };
  const { couleurBadge, description, href, labelBadge, nomIcone, titre }: Props = $props();
  const src = $derived(`/assets/images/parcours-securisation/outils/${nomIcone}.svg`);
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
    horizontal="true"
    size="sm"
    {src}
    title={titre}
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
