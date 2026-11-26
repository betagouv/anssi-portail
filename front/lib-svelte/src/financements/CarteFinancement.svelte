<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import type { Badge } from '../ui/badge.type';
  import GroupeDeBadges from '../ui/GroupeDeBadges.svelte';
  import type { RésuméFinancement } from './financement';

  interface Props {
    financement: RésuméFinancement;
  }

  let { financement }: Props = $props();

  const tags = $derived(financement.entitésÉligibles.map((e) => ({ label: e, id: e })));
  const badges: Badge[] = $derived(
    financement.typesDeFinancement.map((t) => ({ label: t, accent: 'yellow-tournesol' }))
  );
</script>

<dsfr-card
  detail-end={financement.financeur}
  enlarge
  has-detail-end
  href={`/financements/${financement.id}`}
  markup="h6"
  title={financement.nom}
  has-header-badge
  has-badge
>
  <div slot="badgesgroup">
    <GroupeDeBadges {badges} taille="sm" />
  </div>
  <div slot="contentend">
    <dsfr-tags-group tags={enPropriétéWebC(tags)} size="sm" group-markup="span" has-icon></dsfr-tags-group>
  </div>
</dsfr-card>
