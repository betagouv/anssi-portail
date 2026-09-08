<script lang="ts">
  import type { PropriétésFilAriane } from '../../ui/filAriane';
  import HerosRiche from '../../ui/HerosRiche.svelte';
  import CarteRisqueExposition from './CarteRisqueExposition.svelte';
  import { type MenaceEvaluee, menacesPertinentes, type ReponsesExposition } from './expositionCyberattaques';
  import FormulaireExposition from './FormulaireExposition.svelte';

  const propriétésFilAriane: PropriétésFilAriane = {
    branche: { nom: 'Faire le test !', lien: '/faire-le-test/' },
    feuille: 'Mon organisation est-elle exposée aux cyberattaques ?',
  };

  let étape: 'formulaire' | 'résultats' = $state('formulaire');
  let menaces: MenaceEvaluee[] = $state([]);
  let sousTraitanceRenforcée = $state(false);

  const évalue = (reponses: ReponsesExposition) => {
    menaces = menacesPertinentes(reponses);
    sousTraitanceRenforcée = reponses.facteurs.includes('subco');
    étape = 'résultats';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const modifie = () => {
    étape = 'formulaire';
  };
</script>

<HerosRiche
  {propriétésFilAriane}
  variante="cafe-creme"
  class="avec-image-fond"
  description="Rançongiciel, fraude au virement, espionnage, déstabilisation, cyberharcèlement : chaque attaque poursuit un but différent. En 2 minutes, situez celles qui pèsent le plus sur votre organisation."
>
  {#snippet titreHtml()}
    Quels types de cyberattaques peuvent cibler mon organisation ?
  {/snippet}
  {#snippet illustration()}
    <img src="/assets/images/illustration-tests-exposition.svg" alt="" />
  {/snippet}
</HerosRiche>

<dsfr-container>
  {#if étape === 'formulaire'}
    <FormulaireExposition onévaluer={évalue} />
  {:else}
    <div class="résultats">
      <button class="lien-retour" type="button" onclick={modifie}>
        <lab-anssi-icone nom="arrow-left-s-line" taille="sm"></lab-anssi-icone>
        Modifier mes réponses
      </button>

      <div class="bandeau-résultat">
        <lab-anssi-icone nom="alert-fill" taille="lg"></lab-anssi-icone>
        <p>Votre organisation présente des facteurs d’exposition aux cyberattaques</p>
      </div>

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

      <p class="note-source">
        Sources : Panorama de la cybermenace 2025 — ANSSI (CERTFR-2026-CTI-002) ; Rapport d'activité 2025 —
        Cybermalveillance.gouv.fr (GIP ACYMA), fondé sur les signalements et demandes d'assistance de professionnels
        reçus en 2025.<br />
        Cette évaluation mesure des facteurs d'exposition et de sinistralité observée, non une prédiction de la probabilité
        d'incident — laquelle dépend aussi de votre niveau de maturité cyber (sécurisation, sauvegardes, sensibilisation des
        équipes, etc.), non mesuré ici.
      </p>
    </div>
  {/if}
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
  }

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

  .bandeau-résultat {
    align-items: center;
    background-color: var(--background-contrast-warning);
    color: var(--text-default-warning);
    display: flex;
    gap: 1rem;
    padding: 1.5rem;

    p {
      font-weight: bold;
      margin-bottom: 0;
    }
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

  .note-source {
    color: var(--text-mention-grey);
    font-size: 0.75rem;
    line-height: 1.25rem;
    text-align: center;
  }
</style>
