<script lang="ts">
  import Bouton from '../ui/Bouton.svelte';
</script>

<div class="carte-confirmation">
  <div class="contenu-confirmation">
    <h3>Votre demande a bien été envoyée !</h3>
    <p>
      Un Aidant cyber prendra bientôt contact avec vous pour vous accompagner
      dans les prochaines étapes.
    </p>
    <Bouton
      type="primaire"
      titre="Explorer les services pour se lancer"
      on:click={() => (window.location.pathname = '/')}
    />
    <a href="/" class="lien">Revenir à la page d'accueil</a>
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .carte-confirmation {
    max-width: 100%;
    border-radius: 8px;
    border: 1px solid
      var(--Couleurs-Clair-Decisions-Border-_border-default-grey, #ddd);
    background: #fff;
    padding: 48px 24px 72px 24px;

    margin-top: -75px;

    display: flex;
    flex-direction: column;
    gap: 32px;

    @include a-partir-de(md) {
      padding: 48px 80px 72px 80px;
    }

    @include a-partir-de(lg) {
      padding: 48px 80px 72px 80px;
    }
  }

  .contenu-confirmation {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }
</style>
