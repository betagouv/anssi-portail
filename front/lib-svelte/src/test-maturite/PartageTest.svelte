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
      <BoutonsPartageTest {couleurFond} />
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .partage-test {
    padding: 32px var(--gouttiere);

    &.fond-clair {
      background-color: #f6f6f6;
    }

    &.fond-fonce {
      background-color: var(--background-flat-blue-france-lab);
      color: white;
    }

    .contenu-section {
      display: flex;
      flex-direction: column;

      @include a-partir-de(lg) {
        flex-direction: row;
        gap: 24px;
        justify-content: space-between;
      }

      .partage {
        @include a-partir-de(lg) {
          width: 282px;
        }
      }
    }

    h2 {
      margin-bottom: 8px;
      font-size: 1.375rem;
      line-height: 1.75rem;
    }

    p {
      margin-bottom: 24px;
      max-width: 272px;
      @include a-partir-de(lg) {
        max-width: 588px;
      }
    }

    h3 {
      margin-top: 4px;
      font-size: 1.125rem;
      line-height: 1.75rem;
      margin-bottom: 12px;
    }
  }
</style>
