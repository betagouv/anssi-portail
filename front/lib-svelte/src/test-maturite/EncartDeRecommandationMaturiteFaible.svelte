<script lang="ts">
  import DemandeDiagnosticSimplifiee from '../demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';
  import Alternatives from '../ui/Alternatives.svelte';
  import { afficheParcoursSecurisation } from '$plateforme/environnement';
  import EncartPromotionParcoursBasique from '../parcours-securisation/EncartPromotionParcoursBasique.svelte';
  import TagProgrammeGratuit from '../parcours-securisation/TagProgrammeGratuit.svelte';
</script>

<Alternatives affichageAlternatif={afficheParcoursSecurisation}>
  {#snippet défaut()}
    <dsfr-container>
      <div class="contenu-section">
        <hgroup class="preambule">
          <h1>Passez à l'étape suivante</h1>
          <p>
            Votre résultat montre que votre organisation n’est pas suffisamment protégée face aux cyber menaces. L’ANSSI
            vous recommande de réaliser un diagnostic cyber (gratuit) afin de définir rapidement les actions
            prioritaires à mettre en place et renforcer votre cybersécurité.
          </p>
        </hgroup>
        <lab-anssi-icone nom="arrow-down-s-line" taille="lg"></lab-anssi-icone>
        <DemandeDiagnosticSimplifiee origine="test-maturité" />
      </div>
    </dsfr-container>
  {/snippet}

  {#snippet alternatif()}
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
    <div class="contenu-encart-parcours-securisation">
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
  {/snippet}
</Alternatives>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  dsfr-container {
    padding-top: 48px;
  }

  .contenu-encart-cyberdepart {
    padding: 48px 0;
    background-color: var(--background-alt-blue-france);
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
  }
</style>
