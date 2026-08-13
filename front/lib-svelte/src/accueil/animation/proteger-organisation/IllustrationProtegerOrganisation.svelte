<script lang="ts">
  import IllustrationAnimee from '../IllustrationAnimee.svelte';
  import BonReflexe from './BonReflexe.svelte';
  import Decor from './Decor.svelte';
  import EtrePret from './EtrePret.svelte';
  import RisquePrioritaire from './RisquePrioritaire.svelte';

  const { enPause = false }: { enPause?: boolean } = $props();

  const scènes = [RisquePrioritaire, BonReflexe, EtrePret];

  const PROGRESSIONS = [62 / 188, 132 / 188, 1];
</script>

<IllustrationAnimee
  {scènes}
  étiquette="Trois étapes du parcours : sécuriser les accès aux comptes, contrôler les accès aux locaux, définir les contacts et les procédures."
  {enPause}
>
  {#snippet décor(index)}
    <Decor progression={PROGRESSIONS[index]} />
  {/snippet}
</IllustrationAnimee>
