<script lang="ts">
  import { profilStore } from '../stores/profil.store.js';
  import Lien from '../ui/Lien.svelte';
</script>

{#if $profilStore}
  <dsfr-container class="refaire-test">
    <p>
      Vous avez mené un plan d'action cyber et souhaitez mesurer vos progrès ?
      <Lien href="/test-maturite" libelle="Refaire le test" />
    </p>
  </dsfr-container>
{/if}

<style lang="scss">
  .refaire-test {
    padding: 48px 0 0;
  }
</style>
