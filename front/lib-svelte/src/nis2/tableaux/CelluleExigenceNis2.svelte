<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { badgesExigence, type ExigenceNis2 } from '../exigence.type';
  import ContenuExigenceFormate from './ContenuExigenceFormate.svelte';

  export let exigence: ExigenceNis2;

  const tags = [
    ...(exigence.objectifSecurite ? [{ label: exigence.objectifSecurite }] : []),
    { label: exigence.thematique },
    { label: exigence.reference },
  ];
  const badges = badgesExigence(exigence);
</script>

<dsfr-badges-group badges={enPropriétéWebC(badges)} size="sm">
  <ul slot="seo">
    {#each badges as badge (badge)}
      <li>{badge.label}</li>
    {/each}
  </ul></dsfr-badges-group
>
<dsfr-tags-group tags={enPropriétéWebC(tags)} size="sm" groupMarkup="div">
  <ul slot="seo">
    {#each tags as tag (tag)}
      <li>{tag.label}</li>
    {/each}
  </ul>
</dsfr-tags-group>
<ContenuExigenceFormate {exigence} />
