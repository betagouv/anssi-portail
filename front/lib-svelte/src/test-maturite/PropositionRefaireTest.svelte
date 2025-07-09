<script lang="ts">
  import { profilStore } from '../stores/profil.store.js';
</script>

{#if $profilStore}
  <section class="refaire-test">
    <div class="contenu-section">
      <p>
        Mesurez l’évolution de votre maturité cyber pour savoir où vous en êtes et quelles actions renforcer.
        <lab-anssi-lien
          href="/test-maturite" apparence="lien-texte" titre="Débuter le test"></lab-anssi-lien>
      </p>
    </div>
  </section>
{/if}

<style lang="scss">
  .refaire-test {
    padding: 48px var(--gouttiere) 0;
  }
</style>