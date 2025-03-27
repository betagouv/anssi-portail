<script lang="ts">
  import BoutonsPartageTest from './BoutonsPartageTest.svelte';

  export let couleurFond: 'clair' | 'fonce' = 'clair';
</script>

<section class="partage-test fond-{couleurFond}">
  <div class="contenu-section">
    <div class="description">
      <h2>Encouragez d’autres organisations à agir</h2>
      <p>
        Aidez d’autres organisations à accéder à des services et ressources
        adaptés à leur maturité cyber.
      </p>
    </div>
    <div class="partage">
      <h3>Partager le test</h3>
      <BoutonsPartageTest />
    </div>
  </div>
</section>
