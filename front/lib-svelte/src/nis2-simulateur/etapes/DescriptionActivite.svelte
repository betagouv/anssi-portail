<script lang="ts">
  import type { Activite } from '../../../../../back/src/metier/nis2-simulateur/Activite.definitions';
  import { listeDescriptionsActivites } from '../../../../../back/src/metier/nis2-simulateur/ListeDescriptionsActivites';

  /* eslint-disable svelte/no-at-html-tags */
  // Le @html est utilisé sur des valeurs venant de `listeDescriptionsActivites`.
  // Pas sur des entrées d'utilisateurs.

  interface Props {
    activite: Activite;
  }

  let props: Props = $props();

  const descriptions = $derived(listeDescriptionsActivites[props.activite]);

</script>

{#each descriptions as { titre, description }, i (i)}
  <dsfr-highlight text="abc" size="sm">
    <b slot="title">{titre}</b>
    <div class="description-msc" slot="text">
      {@html description}</div>
  </dsfr-highlight>
{/each}


<style lang="scss">
  .description-msc {
    margin-bottom: 12px;
  }

  dsfr-highlight:last-child {
    margin-bottom: 28px;
  }
</style>