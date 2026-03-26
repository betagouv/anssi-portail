<script lang="ts">
  import type { Activite } from '../../../../../back/src/metier/nis2-simulateur/Activite.definitions';
  import { listeDescriptionsActivites } from '../../../../../back/src/metier/nis2-simulateur/ListeDescriptionsActivites';

  interface Props {
    activite: Activite;
  }

  let props: Props = $props();

  const descriptions = $derived(listeDescriptionsActivites[props.activite]);
</script>

{#each descriptions as { titre, description }, i (i)}
  <dsfr-highlight text={description} size="sm">
    <b slot="title">{titre}</b>
  </dsfr-highlight>
{/each}
