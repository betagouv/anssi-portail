<script lang="ts">
  import Bouton from '../ui/Bouton.svelte';
  import Lien from '../ui/Lien.svelte';
  import MachineAEcrireRotative from '../ui/MachineAEcrireCyclique.svelte';
  import Surlignage from '../ui/Surlignage.svelte';
  import IllustrationHeros from './animation/heros/IllustrationHeros.svelte';

  const phrasesAnimées = [
    'mon activité',
    'mes données',
    'mes équipes',
    'ma réputation',
    'mon entreprise',
    'ma collectivité',
  ];

  let enPause = $state(false);
  const libelléPause = $derived(enPause ? 'Lancer les animations' : 'Mettre les animations en pause');

  const basculePause = () => {
    enPause = !enPause;
  };
</script>

<dsfr-container>
  <div class="conteneur-heros">
    <div class="contenu">
      <div class="surtitre fr-h4">
        <MachineAEcrireRotative {phrasesAnimées} préfixe="Je protège " {enPause} />
      </div>
      <h1 class="alternatif-md">
        Agissez pour votre <Surlignage>cybersécurité&nbsp;!</Surlignage>
      </h1>
      <div class="action">
        <Lien
          apparence="bouton"
          href="/cyberdepart"
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
      <IllustrationHeros {enPause} />
    </div>
    <div class="controle-animation">
      <Bouton
        type="secondaire-inverse"
        icone={enPause ? 'play-circle-line' : 'pause-circle-line'}
        iconeSeule
        libelle={libelléPause}
        titre={libelléPause}
        surClic={basculePause}
      />
    </div>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  dsfr-container {
    background-color: var(--background-flat-blue-france);
  }

  .conteneur-heros {
    position: relative;
    display: grid;
    align-content: center;
    grid-template-areas:
      'contenu'
      'illustration';
    padding-block: 6rem;

    .controle-animation {
      position: absolute;
      right: 0;
      bottom: 24px;

      @media (prefers-reduced-motion: reduce) {
        display: none;
      }
    }

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
    }

    .illustration {
      grid-area: illustration;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-inline: auto;
      width: 100%;

      @include a-partir-de(md) {
        max-width: taille-pour-colonnes(8);
      }
      @include a-partir-de(lg) {
        max-width: 100%;
      }
    }
  }
</style>
