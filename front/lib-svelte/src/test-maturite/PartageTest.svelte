<script lang="ts">
  import RetourUtilisateurSurContenu, { type TypeDeRetour } from '../ui/RetourUtilisateurSurContenu.svelte';
  import BoutonsPartagePage from './BoutonsPartagePage.svelte';

  const {
    cheminPartagé,
    sujetMail,
    typeDeRetour,
  }: { cheminPartagé: string; sujetMail: string; typeDeRetour: TypeDeRetour } = $props();

  const clé = $derived.by(() => {
    switch (typeDeRetour) {
      case 'test-maturité':
        return 'resultat-test';
      case 'vrai-faux':
        return 'retour-utilisateur:vrai-faux';
      case 'mesure':
        throw new Error('Ce composant ne doit pas être utilisé pour un retour utilisateur depuis une page mesure');
    }
  });
</script>

<dsfr-container class="partage-test">
  <div class="contenu-section">
    <div class="retour">
      <RetourUtilisateurSurContenu {clé} {typeDeRetour}>
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
