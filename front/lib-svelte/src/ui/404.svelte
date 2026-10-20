<script lang="ts">
  import Lien from './Lien.svelte';
</script>

<dsfr-container>
  <div class="contenu-section">
    <h2>Oups&nbsp;! Cette page est introuvable.</h2>
    <p class="texte-chapo-xl">Nous sommes désolés, la page que vous recherchez n'existe pas.</p>
    <div class="action">
      <Lien apparence="bouton" href="/" libelle="Revenir à la page d’accueil" />
    </div>
    <picture>
      <img src="/assets/images/erreur-404.svg" alt="" />
    </picture>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  dsfr-container {
    .contenu-section {
      margin: 6rem 0;

      h2 {
        margin-bottom: 0.5rem;
      }

      p {
        margin-bottom: 1.5rem;
      }

      .action {
        margin-bottom: 1.5rem;
      }

      picture,
      picture img {
        display: block;
        height: auto;
        margin: 0 auto;
        width: clamp(288px, 100%, 588px);
      }
    }
  }

  @include a-partir-de(lg) {
    dsfr-container {
      .contenu-section {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 1fr repeat(3, auto) 1fr;
        grid-template-areas:
          'avant illustration'
          'titre illustration'
          'texte illustration'
          'actions illustration'
          'apres illustration';
        gap: 0 1.5rem;

        h2 {
          grid-area: titre;
        }

        p {
          grid-area: texte;
        }

        .action {
          grid-area: actions;
          margin-bottom: 0;
        }

        picture {
          grid-area: illustration;
          align-self: center;
        }
      }
    }
  }
</style>
