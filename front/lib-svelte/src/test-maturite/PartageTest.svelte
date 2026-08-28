<script lang="ts">
  import RetourUtilisateurSurContenu from '../ui/RetourUtilisateurSurContenu.svelte';
  import BoutonsPartageTest from './BoutonsPartageTest.svelte';
</script>

<dsfr-container class="partage-test">
  <div class="contenu-section">
    <div class="retour">
      <RetourUtilisateurSurContenu clé="resultat-test" urlDePost="/api/retour-test-maturite">
        <b>Ce test vous a-t-il aidé&nbsp;?</b>
      </RetourUtilisateurSurContenu>
    </div>
    <div class="partage">
      <h3>Partager le test</h3>
      <BoutonsPartageTest />
    </div>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .partage-test {
    padding: 32px 0;
    background-color: #f6f6f6;

    .contenu-section {
      display: flex;
      flex-direction: column;

      @include a-partir-de(lg) {
        flex-direction: row;
        gap: 24px;
      }

      .retour {
        flex: 1;
      }

      .partage {
        @include a-partir-de(lg) {
          width: 282px;
        }
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
