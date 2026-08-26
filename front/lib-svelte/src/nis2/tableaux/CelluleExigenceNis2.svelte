<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import GroupeDeBadges from '../../ui/GroupeDeBadges.svelte';
  import { badgesExigence, type ExigenceNis2 } from '../exigence.type';
  import ContenuExigenceFormate from './ContenuExigenceFormate.svelte';

  interface Props {
    exigence: ExigenceNis2;
  }

  let { exigence }: Props = $props();

  const tags = $derived([
    ...(exigence.objectifSecurite ? [{ label: exigence.objectifSecurite }] : []),
    { label: exigence.thematique },
    { label: exigence.reference },
  ]);
  const badges = $derived(badgesExigence(exigence));
</script>

<GroupeDeBadges {badges} />
<dsfr-tags-group tags={enPropriétéWebC(tags)} size="sm" groupMarkup="div">
  <ul slot="seo">
    {#each tags as tag (tag)}
      <li>{tag.label}</li>
    {/each}
  </ul>
</dsfr-tags-group>
<ContenuExigenceFormate {exigence} />
