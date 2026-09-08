<script lang="ts">
  import { afficheParcoursSecurisation } from '$plateforme/environnement';
  import DemandeDiagnosticSimplifiee from '../../demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';
  import EncartPromotionParcoursBasique from '../../parcours-securisation/EncartPromotionParcoursBasique.svelte';
  import TagProgrammeGratuit from '../../parcours-securisation/TagProgrammeGratuit.svelte';
  import Alternatives from '../../ui/Alternatives.svelte';
  import Notice from '../../ui/Notice.svelte';
  import CarteRisqueExposition from './CarteRisqueExposition.svelte';
  import type { MenaceEvaluee } from './expositionCyberattaques';

  const {
    retour,
    menaces,
    sousTraitanceRenforcée,
  }: { retour: () => void; menaces: MenaceEvaluee[]; sousTraitanceRenforcée: boolean } = $props();
</script>

<dsfr-container>
  <div class="résultats">
    <button class="lien-retour" type="button" onclick={retour}>
      <lab-anssi-icone nom="arrow-left-s-line" taille="sm"></lab-anssi-icone>
      Modifier mes réponses
    </button>

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

    {#if sousTraitanceRenforcée}
      <div class="bulle-sous-traitance">
        <lab-anssi-icone nom="links-line" taille="md"></lab-anssi-icone>
        <p>
          L'ANSSI documente une proportion croissante de cyberattaques impliquant la compromission préalable d'un
          sous-traitant ou d'un prestataire pour atteindre une cible finale. Infogéreur, prestataire Cloud, éditeurs
          logiciel peuvent constituer une porte d'entrée vers vos données ou vos systèmes d'information. Par ailleurs,
          une violation de données subie par un partenaire, un fournisseur ou un service tiers que vous utilisez peut,
          même sans compromission directe de vos propres systèmes, exposer indirectement des informations vous
          concernant (identité, coordonnées, données bancaires) et alimenter des attaques secondaires contre votre
          organisation : hameçonnage ciblé, fraude au virement, usurpation d'identité.
        </p>
      </div>
    {/if}
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
    padding-top: 3.5rem;
  }

  .résultats {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .lien-retour {
      align-items: center;
      align-self: flex-start;
      background: none;
      border: 1px solid var(--border-default-grey);
      border-radius: 1.5rem;
      color: var(--text-action-high-blue-france);
      cursor: pointer;
      display: flex;
      gap: 0.25rem;
      padding: 0.375rem 1rem;
    }

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

    .bulle-sous-traitance {
      background-color: var(--background-default-grey);
      border: 1px solid var(--border-default-grey);
      display: flex;
      gap: 0.75rem;
      padding: 1.5rem;

      p {
        margin-bottom: 0;
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
