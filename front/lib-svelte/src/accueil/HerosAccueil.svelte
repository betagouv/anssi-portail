<script lang="ts">
  import Lien from '../ui/Lien.svelte';
</script>

<dsfr-container>
  <div class="conteneur-heros">
    <div class="contenu">
      <div class="surtitre fr-h4">Je protège mon activité</div>
      <h1 class="alternatif-md">
        Agissez pour votre <span class="surligne-gauche-droite">cybersécurité&nbsp;!</span>
      </h1>
      <div class="action">
        <Lien
          apparence="bouton"
          href="#"
          libelle="Protéger mon organisation"
          iconeADroite
          icone="arrow-right-circle-fill"
          type="primaire-inverse"
          taille="lg"
          etire
        />
      </div>
    </div>
    <div class="illustration">
      <img
        src="/assets/images/mario-dsi-et-femme-qui-utilisent-mss.png"
        alt="Mario, le DSI et une femme utilisent MSS"
      />
    </div>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  dsfr-container {
    background-color: var(--background-flat-blue-france);

    .conteneur-heros {
      display: grid;
      align-content: center;
      grid-template-areas:
        'contenu'
        'illustration';
      padding-block: 6rem;

      @include a-partir-de(lg) {
        grid-template-areas: 'contenu illustration';
        grid-template-columns: auto taille-pour-colonnes(5);
        column-gap: 1.5rem;
      }

      .contenu {
        grid-area: contenu;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .surtitre {
          text-transform: uppercase;
          color: var(--yellow-moutarde-925-125);
          margin-bottom: 0.75rem;
        }
        h1 {
          margin-bottom: 3rem;
          color: var(--text-inverted-grey);
          word-break: break-word;
          z-index: 10;
        }
        .action {
          display: flex;
          flex-direction: column;
          margin-bottom: 3rem;
          @include a-partir-de(md) {
            flex-direction: row;
          }
          @include a-partir-de(lg) {
            margin-bottom: 0;
          }
        }

        .surligne-gauche-droite {
          position: relative;
          z-index: 10;

          @include a-partir-de(md) {
            &:after {
              background: url('/assets/images/surligne-gauche-droite-vert-clair.svg') no-repeat;
              content: '';
              width: 100%;
              height: 100%;
              top: 70%;
              right: 0;
              position: absolute;
              z-index: -1;
            }
          }
        }
      }

      .illustration {
        grid-area: illustration;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-inline: auto;

        @include a-partir-de(md) {
          max-width: taille-pour-colonnes(8);
        }
        @include a-partir-de(lg) {
          max-width: 100%;
        }

        img {
          width: 100%;
        }
      }
    }
  }
</style>
