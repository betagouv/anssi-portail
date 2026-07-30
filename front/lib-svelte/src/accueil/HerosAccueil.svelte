<script lang="ts">
  import Lien from '../ui/Lien.svelte';
  import Surlignage from '../ui/Surlignage.svelte';

  let texte = 'Je protège mon activité et je sécurise mes données personnelles';
  let lettres = texte.split('');
</script>

<dsfr-container>
  <div class="conteneur-heros">
    <div class="contenu">
      <div class="surtitre fr-h4">
        <span class="typewriter" aria-label={texte}>
          {#each lettres as lettre, i (i)}
            <span aria-hidden="true" class="lettre" class:espace={lettre === ' '} style="animation-delay: {i * 0.05}s">
              {lettre}
            </span>
          {/each}
          <span aria-hidden="true" class="curseur" style="animation-delay: {lettres.length * 0.05}s">&nbsp;</span>
        </span>
      </div>
      <h1 class="alternatif-md">
        Agissez pour votre <Surlignage>cybersécurité&nbsp;!</Surlignage>
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
          margin-right: auto;
        }

        .typewriter {
          display: inline; /* permet le retour à la ligne naturel */
        }

        .lettre {
          opacity: 0;
          animation: apparition-lettre 0.05s linear forwards;
        }

        .curseur {
          border-right: 4px solid orange;
          opacity: 0;
          animation:
            apparition 0.01s linear forwards,
            blink-caret 0.75s step-end infinite;
          animation-fill-mode: forwards, none;
          vertical-align: text-bottom;
        }

        @keyframes apparition-lettre {
          0% {
            border-right: 4px solid orange;
            opacity: 1;
          }
          90% {
            border-right: 4px solid orange;
          }
          100% {
            opacity: 1;
            border-right: none;
          }
        }

        @keyframes apparition {
          to {
            opacity: 1;
          }
        }

        @keyframes blink-caret {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: orange;
          }
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
