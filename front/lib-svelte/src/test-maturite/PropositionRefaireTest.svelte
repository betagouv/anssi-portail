<script lang="ts">
  import { profilStore } from '../stores/profil.store.js';
</script>

{#if $profilStore}
  <section class="refaire-test">
    <div class="contenu-section">
      <p>
        Vous avez mené un plan d'action cyber et souhaitez mesurer vos progrès ?
        <lab-anssi-lien
          href="/test-maturite"
          apparence="lien-texte"
          titre="Refaire le test"
        ></lab-anssi-lien>
      </p>
    </div>
  </section>
{/if}

<style lang="scss">
  .refaire-test {
    padding: 48px var(--gouttiere) 0;
  }
</style>
