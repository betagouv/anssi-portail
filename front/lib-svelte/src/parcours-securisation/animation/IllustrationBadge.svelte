<script lang="ts">
  import { afficheBadgeCyberdépart } from '$plateforme/environnement';
  import IllustrationAnimee from '../../accueil/animation/IllustrationAnimee.svelte';
  import SectionBadge from './SectionBadge.svelte';
  import SectionCyberdépart from './SectionCyberdepart.svelte';

  const scènes = afficheBadgeCyberdépart ? [SectionBadge] : [SectionCyberdépart];
  const étiquette = afficheBadgeCyberdépart
    ? 'Une barre de progression complétée et le badge Cyberdépart débloqué.'
    : 'Une barre de progression complétée et la section Cyberdépart validée.';
</script>

<IllustrationAnimee {scènes} {étiquette} />
