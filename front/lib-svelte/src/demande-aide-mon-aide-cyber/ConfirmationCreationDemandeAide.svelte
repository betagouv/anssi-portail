<script lang="ts">
  import Bouton from '../ui/Bouton.svelte';
</script>

<div class="carte-confirmation">
  <h3>Votre demande a bien été envoyée&nbsp;!</h3>
  <p>
    Un Aidant cyber prendra bientôt contact avec vous pour vous accompagner dans
    les prochaines étapes.
  </p>
  <Bouton
    type="primaire"
    taille="md"
    titre="Explorer les services pour se lancer"
    on:click={() => (window.location.pathname = '/')}
  />
  <a href="/" class="lien">Revenir à la page d'accueil</a>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .carte-confirmation {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    max-width: 792px;
    padding: 48px 24px 72px 24px;
    margin: auto;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: #fff;

    @include a-partir-de(md) {
      padding: 48px 80px 72px 80px;
    }

    h3 {
      margin: 24px 0 10px 0;
    }
    p {
      margin: 0 0 40px;
    }
    a {
      margin-top: 16px;
    }
  }
</style>
