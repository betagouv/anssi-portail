<script lang="ts">
  import { clic } from '../directives/actions.svelte';
  import { afficheParcoursSecurisation } from '$plateforme/environnement';
  import Alternatives from '../ui/Alternatives.svelte';
  import EncartPromotionParcoursComplet from '../parcours-securisation/EncartPromotionParcoursComplet.svelte';
  import TagProgrammeGratuit from '../parcours-securisation/TagProgrammeGratuit.svelte';

  const connexion = () => {
    sessionStorage.setItem('pagePostConnexion', '/ma-maturite#comparaison');
  };
</script>

<Alternatives affichageAlternatif={afficheParcoursSecurisation}>
  {#snippet défaut()}
    <dsfr-container>
      <div class="contenu-section">
        <hgroup class="preambule">
          <h1>Passez à l'étape suivante</h1>
          <p>
            Comparez la maturité de votre organisation à celle d’entités similaires et suivez votre évolution dans le
            temps.
          </p>
        </hgroup>
        <lab-anssi-icone nom="arrow-down-s-line" taille="lg"></lab-anssi-icone>
        <div class="apercu-comparaison">
          <div class="connexion">
            <p>
              Connectez-vous ou inscrivez-vous sur MesServicesCyber pour accéder à la comparaison de votre maturité
              cyber.
            </p>
            <dsfr-connect use:clic={connexion} href="/oidc/connexion"></dsfr-connect>
          </div>
        </div>
      </div>
    </dsfr-container>
  {/snippet}

  {#snippet alternatif()}
    <dsfr-container>
      <div class="contenu-section">
        <hgroup class="preambule">
          <h1>Franchissez un cap supplémentaire</h1>
          <p>
            Pour consolider votre niveau et aller encore plus loin, l'ANSSI vous recommande de poursuivre vos efforts
            avec un <b>programme gratuit pour renforcer votre cybersécurité</b> contre les risques les plus courants et
            <b>faciliter votre démarche de mise en conformité NIS 2</b>, si vous êtes concerné.
          </p>
        </hgroup>
        <lab-anssi-icone nom="arrow-down-s-line" taille="lg"></lab-anssi-icone>
      </div>
    </dsfr-container>
    <div class="contenu-encart-parcours-securisation">
      <EncartPromotionParcoursComplet
        titre="6 modules pour vous protéger contre les risques les plus courants"
        description="Un programme d'accompagnement gratuit, pensé pour les PME/ETI et les organisations concernées par la directive NIS 2."
        orientation="droite"
      >
        {#snippet tags()}
          <TagProgrammeGratuit />
        {/snippet}
      </EncartPromotionParcoursComplet>
    </div>
  {/snippet}
</Alternatives>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  dsfr-container {
    padding-top: 48px;
  }

  .contenu-encart-parcours-securisation {
    margin-top: 48px;
    padding: 96px 0;
    background-color: var(--yellow-moutarde-925-125);
  }

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

      @include a-partir-de(md) {
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

        @include a-partir-de(md) {
          max-width: taille-pour-colonnes(8);
        }

        @include a-partir-de(lg) {
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
