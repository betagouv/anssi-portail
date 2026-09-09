<script lang="ts">
  import { afficheParcoursSecurisation } from '$plateforme/environnement';
  import DemandeDiagnosticSimplifiee from '../../demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';
  import EncartPromotionParcoursBasique from '../../parcours-securisation/EncartPromotionParcoursBasique.svelte';
  import TagProgrammeGratuit from '../../parcours-securisation/TagProgrammeGratuit.svelte';
  import Alternatives from '../../ui/Alternatives.svelte';
  import Notice from '../../ui/Notice.svelte';
  import CarteRisqueExposition from './CarteRisqueExposition.svelte';
  import type { MenaceEvaluee } from './expositionCyberattaques';

  const { menaces }: { menaces: MenaceEvaluee[] } = $props();
</script>

<dsfr-container>
  <div class="résultats">
    <Notice
      type="attention"
      estRejetable={false}
      aUneIcone
      titre="Votre organisation présente des facteurs d’exposition aux cyberattaques"
    />

    <h2>Détail des risques</h2>
    <div class="grille-cartes">
      {#each menaces as menace (menace.id)}
        <CarteRisqueExposition {menace} />
      {/each}
    </div>
  </div>
</dsfr-container>

<Alternatives affichageAlternatif={afficheParcoursSecurisation}>
  {#snippet défaut()}
    <dsfr-container>
      <DemandeDiagnosticSimplifiee origine="exposition" />
    </dsfr-container>
  {/snippet}
  {#snippet alternatif()}
    <section class="section-parcours-basique">
      <EncartPromotionParcoursBasique
        titre="12 mesures simples pour protéger votre organisation contre les cyberattaques"
        description="Accédez à 12 mesures simples pour protéger dès maintenant votre organisation contre les cyberattaques et prendre votre Cyberdépart ! 🚀"
      >
        {#snippet tags()}
          <TagProgrammeGratuit />
        {/snippet}
      </EncartPromotionParcoursBasique>
    </section>
  {/snippet}
</Alternatives>

<dsfr-container class="note-source">
  <p class="texte-mention-xs">
    Sources : Panorama de la cybermenace 2025 — ANSSI (CERTFR-2026-CTI-002) ; Rapport d'activité 2025 —
    Cybermalveillance.gouv.fr (GIP ACYMA), fondé sur les signalements et demandes d'assistance de professionnels reçus
    en 2025.<br />
    <br />
    Cette évaluation mesure des facteurs d'exposition et de sinistralité observée, non une prédiction de la probabilité d'incident
    — laquelle dépend aussi de votre niveau de maturité cyber (sécurisation, sauvegardes, sensibilisation des équipes, etc.),
    non mesuré ici.
  </p>
</dsfr-container>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille' as *;

  dsfr-container {
    display: block;
    padding-bottom: 4rem;
  }

  .résultats {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    h2 {
      margin-bottom: 0;
    }

    .grille-cartes {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: minmax(0, 1fr);

      @include a-partir-de(md) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      @include a-partir-de(lg) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
  }

  .section-parcours-basique {
    background-color: var(--background-alt-yellow-moutarde);
    padding-block: 6rem;
  }

  .note-source {
    background-color: var(--background-alt-grey);
    padding: 1.5rem 0;

    p {
      margin: 0;
    }
  }
</style>
