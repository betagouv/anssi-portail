<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import Bouton from '../ui/Bouton.svelte';
  import Lien from '../ui/Lien.svelte';
  import IllustrationProtegerOrganisation from './animation/proteger-organisation/IllustrationProtegerOrganisation.svelte';
  import MotEnExergue from '../ui/MotEnExergue.svelte';

  const tags = [{ label: 'TPE' }, { label: 'PME' }, { label: 'ETI' }, { label: 'Collectivités' }];

  let enPause = $state(false);
  const libelléPause = $derived(enPause ? 'Lancer les animations' : 'Mettre les animations en pause');

  const basculePause = () => {
    enPause = !enPause;
  };
</script>

<dsfr-container class="proteger-organisation fond-macaron">
  <div class="conteneur">
    <div class="en-tete">
      <span class="badge-accompagnement">+6000 organisations déjà accompagnées 🚀</span>
      <h2 class="titre fr-h1">
        Chaque organisation a son point de <MotEnExergue motif="cercle">départ.</MotEnExergue>
        <br />Trouvez le vôtre.
      </h2>

      <p class="description">
        Débutante ou déjà engagée, Mes&ZeroWidthSpace;Services&ZeroWidthSpace;Cyber propose à votre organisation un
        parcours gratuit adapté à son niveau en cybersécurité. 12&nbsp;mesures pour démarrer (ou «&nbsp;pour prendre son
        Cyberdépart&nbsp;») avec l'aide d'un Aidant cyber si besoin. 55&nbsp;mesures pour aller plus loin.
      </p>
    </div>

    <div class="tags">
      <dsfr-tags-group tags={enPropriétéWebC(tags)}></dsfr-tags-group>
    </div>

    <figure class="illustration">
      <IllustrationProtegerOrganisation {enPause} />
      <div class="controle-animation">
        <Bouton
          type="secondaire"
          icone={enPause ? 'play-circle-line' : 'pause-circle-line'}
          iconeSeule
          libelle={libelléPause}
          titre={libelléPause}
          surClic={basculePause}
        />
      </div>
    </figure>

    <Lien
      apparence="bouton"
      href="/parcours-securisation/"
      libelle="Découvrir les parcours"
      type="primaire"
      taille="lg"
      icone="arrow-right-circle-fill"
      iconeADroite
    />
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .proteger-organisation {
    padding: var(--padding-section, 6rem 0);

    background: {
      image: url('/assets/images/motif-fond-macaron.svg');
      repeat: no-repeat;
      position: center bottom;
    }

    @include a-partir-de(lg) {
      background-position: right bottom;
    }

    .controle-animation {
      display: flex;
      justify-content: flex-end;

      @media (prefers-reduced-motion: reduce) {
        display: none;
      }
    }

    .conteneur {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3rem;

      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(10);
        margin-inline: auto;
      }
    }

    .en-tete {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      text-align: center;
    }

    .badge-accompagnement {
      background-color: var(--green-bourgeon-950-100);
      border-radius: 100px;
      padding: 6px 16px 8px;
      font-weight: 700;
      font-size: 1rem;
      line-height: 1.5rem;
      color: var(--text-title-grey);
    }

    .titre {
      margin-block: 0;
    }

    .description {
      color: var(--text-default-grey);
      font-size: 1.125rem;
      line-height: 1.75rem;
      margin-block: 0;
    }

    .illustration {
      margin: 0 auto;
      width: 100%;

      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(8);
      }
    }
  }
</style>
