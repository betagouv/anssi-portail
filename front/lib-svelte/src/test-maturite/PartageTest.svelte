<script lang="ts">
  import RetourUtilisateurSurContenu, { type TypeDeRetour } from '../ui/RetourUtilisateurSurContenu.svelte';
  import BoutonsPartagePage from './BoutonsPartagePage.svelte';

  const {
    cheminPartagé,
    sujetMail,
    typeDeRetour,
  }: { cheminPartagé: string; sujetMail: string; typeDeRetour: TypeDeRetour } = $props();
</script>

<dsfr-container class="partage-test">
  <div class="contenu-section">
    <div class="retour">
      <RetourUtilisateurSurContenu clé="resultat-test" {typeDeRetour}>
        <p class="texte-article-lg">Ce test vous a-t-il aidé&nbsp;?</p>
      </RetourUtilisateurSurContenu>
    </div>
    <BoutonsPartagePage {cheminPartagé} {sujetMail} />
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .partage-test {
    padding: 2rem 0;

    .contenu-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      @include a-partir-de(lg) {
        flex-direction: row;
      }

      .retour {
        flex: 1;

        .texte-article-lg {
          font-weight: bold;
          margin-bottom: 1rem;
        }
      }
    }
  }
</style>
