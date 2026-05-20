<script lang="ts">
  import FilAriane from './FilAriane.svelte';
  import type { Branche } from './filAriane';

  export let titre: string;
  export let description: string;
  export let ariane: string | undefined;
  export let arianeBranche: Branche | undefined = undefined;
  export let arianeBrancheConnectee: Branche | undefined = undefined;
</script>

<dsfr-container class="chapeau fond-sombre">
  <div class="contenu-section">
    {#if ariane}
      <FilAriane feuille={ariane} branche={arianeBranche} brancheConnectee={arianeBrancheConnectee} fondSombre />
    {/if}
    <h1 class="alternatif-xs-ns">{titre}</h1>
    <p class="texte-chapo-xl-ns">{description}</p>
  </div>
</dsfr-container>

<style lang="scss">
  .contenu-section {
    display: flex;
    flex-direction: column;

    .texte-chapo-xl-ns {
      margin: 0;
    }
  }
</style>
