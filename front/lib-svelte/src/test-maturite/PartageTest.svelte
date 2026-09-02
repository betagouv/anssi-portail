<script lang="ts">
  import RetourUtilisateurSurContenu from '../ui/RetourUtilisateurSurContenu.svelte';
  import BoutonsPartageTest from './BoutonsPartageTest.svelte';
</script>

<dsfr-container class="partage-test">
  <div class="contenu-section">
    <div class="retour">
      <RetourUtilisateurSurContenu clé="resultat-test" urlDePost="/api/retour-test-maturite">
        <p class="texte-article-lg">Ce test vous a-t-il aidé&nbsp;?</p>
      </RetourUtilisateurSurContenu>
    </div>
    <div class="partage">
      <p class="texte-standard-md">Partager la page</p>
      <BoutonsPartageTest />
    </div>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .partage-test {
    padding: 2rem 0;

    .contenu-section {
      display: flex;
      flex-direction: column;

      @include a-partir-de(lg) {
        flex-direction: row;
        gap: 1.5rem;
      }

      .retour {
        flex: 1;

        .texte-article-lg {
          font-weight: bold;
          margin-bottom: 1rem;
        }
      }

      .partage {
        .texte-standard-md {
          margin-bottom: 1rem;
        }

        @include a-partir-de(lg) {
          width: 282px;
        }
      }
    }
  }
</style>
