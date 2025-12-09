<script lang="ts">
</script>

<section>
  <div class="contenu-section">
    <hgroup class="preambule">
      <h1>Passez à l'étape suivante</h1>
      <p>
        Comparez la maturité de votre organisation à celle d’entités similaires
        et suivez votre évolution dans le temps.
      </p>
    </hgroup>
    <lab-anssi-icone nom="arrow-down-s-line" taille="lg"></lab-anssi-icone>
    <div class="apercu-comparaison">
      <div class="connexion">
        <p>Connectez-vous ou inscrivez-vous sur MesServicesCyber pour accéder à la comparaison de votre maturité cyber.</p>
        <dsfr-connect href="/oidc/connexion"></dsfr-connect>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;
  .contenu-section {
    display: flex;
    flex-direction: column;
    gap: 24px;

    p {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }

    hgroup.preambule {
      text-align: center;
      align-self: center;
      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(10);
      }
      h1 {
        font-size: 2rem;
        line-height: 2.5rem;
        margin: 0 0 24px;

        @include a-partir-de(md) {
          font-size: 2.5rem;
          line-height: 3rem;
        }
      }
    }

    lab-anssi-icone {
      align-self: center;
    }

    .apercu-comparaison {
      background-image: url('/assets/images/test-maturite/comparaison-floue-xs.avif');
      background-repeat: no-repeat;
      background-size: cover;
      padding: 200px 16px;
      border-radius: 8px;

      @include  a-partir-de(md) {
        background-image: url('/assets/images/test-maturite/comparaison-floue-md.avif');
      }

      .connexion {
        background: white;
        border-radius: 8px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-inline: auto;

        @include a-partir-de(md){
          max-width: taille-pour-colonnes(8);
        }

        @include a-partir-de(lg){
          max-width: taille-pour-colonnes(6);
        }

        p {
          margin: 0 0 24px;
          color: #3a3a3a;
          font-size: 1.125rem;
          line-height: 1.75rem;
          font-weight: bold;
          text-align: center;
        }
      }
    }
  }
</style>
