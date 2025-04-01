<script lang="ts">
  import BoutonsPartageTest from './BoutonsPartageTest.svelte';

  export let testRealise = false;
</script>

<section class="comparaison">
  <div class="contenu-section">
    <img
      src="/assets/images/illustration-dragon-aucun-resultat.svg"
      alt="Bientôt disponible"
    />
    {#if testRealise}
      <h4>Bientôt disponible pour votre organisation.</h4>
      <p class="description-test-realise">
        Améliorez l’expérience pour vous et les autres organisations en
        partageant le test de maturité.
      </p>
      <BoutonsPartageTest />
    {:else}
      <h4>Bientôt disponible pour votre organisation.</h4>
      <p>
        Contribuez à enrichir l’expérience pour vous et les autres organisations
        en evaluant votre maturité cyber.
      </p>
      <a href="/test-maturite" class="bouton primaire">
        Tester votre maturité cyber
      </a>
    {/if}
  </div>
</section>

<style>
  .description-test-realise {
    margin-bottom: 16px;
  }
</style>
