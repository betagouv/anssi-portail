<script lang="ts">
  import DemandeDiagnosticSimplifiee from '../demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';
  import CarrouselDesInterlocuteurs from '../interlocuteurs/CarrouselDesInterlocuteurs.svelte';
  import EquipeBizDev from '../interlocuteurs/EquipeBizDev.svelte';
  import { afficheParcoursSecurisation } from '$plateforme/environnement';
  import EncartPromotionParcoursBasique from '../parcours-securisation/EncartPromotionParcoursBasique.svelte';
  import TagProgrammeGratuit from '../parcours-securisation/TagProgrammeGratuit.svelte';

  interface Props {
    origine: string;
  }

  let { origine }: Props = $props();

  const codecVideoWebM = 'video/webm; codecs="vp9,opus"';
</script>

<dsfr-container id="proteger" class="proteger">
  {#if origine !== 'landing-collectivites' && !afficheParcoursSecurisation}
    <div class="introduction">
      <h2>Découvrez les risques pour votre organisation en cas de cyberattaque</h2>
      <!-- Les sous-titres sont intégrés dans la vidéo -->
      <video
        id="video-risques"
        controls
        preload="metadata"
        poster="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/Video_Risques.avif"
      >
        <source
          src="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/Video_Risques.av1.mp4"
          type="video/mp4; codecs=av01.0.05M.08"
        />
        <source
          src="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/Video_Risques.webm"
          type={codecVideoWebM}
        />
        <source
          src="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/Video_Risques.mp4"
          type="video/mp4; codecs=avc1.42E01E"
        />
      </video>
    </div>
  {/if}

  {#if !afficheParcoursSecurisation}
    <div class="demande">
      <DemandeDiagnosticSimplifiee {origine} />
    </div>

    <div class="interlocuteurs">
      <CarrouselDesInterlocuteurs />
    </div>
  {/if}
</dsfr-container>

{#if afficheParcoursSecurisation}
  <div class="contenu-encart-parcours-basique">
    <EncartPromotionParcoursBasique
      titre="13 mesures simples pour protéger votre organisation contre les cyberattaques"
      description="Un programme d'accompagnement gratuit, pensé pour les non-experts."
    >
      {#snippet tags()}
        <TagProgrammeGratuit />
      {/snippet}
    </EncartPromotionParcoursBasique>
  </div>
  <dsfr-container class="contenu-encart-cyberdepart">
    <p>
      <b>Vous préférez échanger avec un Aidant cyber ?</b> Le diagnostic cyberdépart vous permet de bénéficier d’un
      accompagnement gratuit d’1 heure avec un Aidant cyber bénévole, à distance ou dans vos locaux. Retrouvez votre
      plan d’action sur MesServicesCyber.
      <dsfr-link label="Demander un accompagement gratuit" neutral href="/cyberdepart"></dsfr-link>
    </p>
  </dsfr-container>
  <dsfr-container class="interlocuteurs-avec-parcours-securisation">
    <CarrouselDesInterlocuteurs />
  </dsfr-container>
{/if}

<dsfr-container class="equipe-biz-dev {afficheParcoursSecurisation ? 'avec-parcours-securisation' : ''}">
  <EquipeBizDev />
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .proteger {
    margin-top: 48px;

    .introduction {
      padding-bottom: 72px;

      margin-inline: auto;
      max-width: 100%;
      @include a-partir-de(md) {
        max-width: taille-pour-colonnes(10);
      }
      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(6);
      }

      h2 {
        text-align: center;
        margin-bottom: 48px;
      }

      video {
        width: 100%;
      }
    }
  }

  .demande {
    padding-block: 40px;
  }

  .contenu-encart-parcours-basique {
    padding-top: 48px;
  }

  .contenu-encart-cyberdepart {
    padding: 48px 0;
    background-color: var(--background-default-grey);
  }

  .interlocuteurs-avec-parcours-securisation {
    padding: 72px 0 24px;
    background-color: var(--blue-france-850-200);
  }

  .interlocuteurs {
    margin-inline: auto;
    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(10);
    }
  }

  .equipe-biz-dev {
    padding-block: 56px;
    background-color: var(--background-alt-blue-france);

    &.avec-parcours-securisation {
      background-color: var(--brown-cafe-creme-975-75);
    }
  }
</style>
