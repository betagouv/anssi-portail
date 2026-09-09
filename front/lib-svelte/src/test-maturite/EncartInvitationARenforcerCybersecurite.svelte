<script lang="ts">
</script>

<dsfr-container>
  <div class="contenu-section">
    <hgroup class="preambule">
      <h1>Renforcez votre cybersécurité dès maintenant</h1>
      <p>
        Votre organisation n’est pas suffisamment protégée face aux cyber menaces. L’ANSSI vous recommande de
        <b>mettre en place des premières mesures simples</b> pour vous protéger rapidement.
      </p>
    </hgroup>
    <lab-anssi-icone nom="arrow-down-s-line" taille="lg"></lab-anssi-icone>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  dsfr-container {
    margin-top: 4rem;

    .contenu-section {
      display: flex;
      flex-direction: column;
      gap: 24px;

      p {
        font-size: 1.125rem;
        line-height: 1.75rem;
        margin: 0;
      }

      hgroup.preambule {
        text-align: center;
        align-self: center;
        @include a-partir-de(lg) {
          max-width: taille-pour-colonnes(10);
        }

        h1 {
          margin: 0 0 24px;
        }
      }

      lab-anssi-icone {
        align-self: center;
      }
    }
  }
</style>
