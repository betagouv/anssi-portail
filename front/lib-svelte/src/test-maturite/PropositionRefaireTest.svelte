<script lang="ts">
  import { profilStore } from '../stores/profil.store.js';
  import Lien from '../ui/Lien.svelte';
</script>

{#if $profilStore}
  <section class="refaire-test">
    <div class="contenu-section">
      <p>
        Vous avez mené un plan d'action cyber et souhaitez mesurer vos progrès ?
        <Lien href="/test-maturite" libelle="Refaire le test" />
      </p>
    </div>
  </section>
{/if}

<style lang="scss">
  .refaire-test {
    padding: 48px var(--gouttiere) 0;
  }
</style>
