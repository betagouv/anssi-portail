<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import BadgeTypeFinancement from './BadgeTypeFinancement.svelte';
  import type { Financement, ResumeFinancement } from './financement';
  import SectionDetailsFinancement from './SectionDetailsFinancement.svelte';

  type ReponseAxios = {
    id: number;
    nom: string;
    financeur: string;
    typesDeFinancement: string[];
    entitesElligibles: string[];
    perimetresGeographiques: string[];
    regions: string[];
    objectifs: string;
    operationsEligibles: string;
    benificiaires: string;
    montant: string;
    condition: string;
    sources: string[];
    contact: string;
  };

  export let resumeFinancement: ResumeFinancement;
  let financement: Financement | undefined;

  onMount(async () => {
    try {
      const reponse = await axios.get<ReponseAxios>(
        `/api/financements/${resumeFinancement.id}`
      );
      financement = reponse.data;
    } catch {
      financement = undefined;
    }
  });
</script>

<section class="chapeau">
  <div class="contenu-section">
    <FilAriane
      feuille={resumeFinancement.nom}
      branche={{ nom: 'Financements cyber', lien: '/financements' }}
    />
    <div class="badges">
      {#each resumeFinancement.typesDeFinancement as type (type)}
        <BadgeTypeFinancement>{type}</BadgeTypeFinancement>
      {/each}
    </div>
    <h1>{resumeFinancement.nom}</h1>
    <p>
      {`Zone géographique éligible pour cette aide : ${resumeFinancement.perimetresGeographiques}`}
    </p>
  </div>
</section>

{#if financement}
  <section class="corps">
    <div class="contenu-section">
      <div class="sommaire"></div>
      <div class="fiche">
        <div class="financePar">
          <p>Financé par : <strong>{financement.financeur}</strong></p>
        </div>
        <SectionDetailsFinancement
          ancre="objectifs"
          titre="Objectifs"
          detail={financement.objectifs}
        />
        <SectionDetailsFinancement
          ancre="operations-eligibles"
          titre="Opérations éligibles"
          detail={financement.operationsEligibles}
        />

        <SectionDetailsFinancement
          ancre="beneficiaires"
          titre="Bénéficiaires"
          detail={financement.benificiaires}
        />

        <SectionDetailsFinancement
          ancre="montant"
          titre="Montant"
          detail={financement.montant}
        />

        <SectionDetailsFinancement
          ancre="conditions"
          titre="Conditions"
          detail={financement.condition}
        />
      </div>
    </div>
  </section>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  section {
    padding: 0 var(--gouttiere) 40px;
  }

  .corps {
    padding: 48px 16px 72px;
    @include a-partir-de(md) {
      padding: 24px 24px 72px;
    }
  }

  .chapeau {
    background: #f4f4f4 url('/assets/images/motif-fond-service.png');
    padding-top: 24px;

    .contenu-section {
      display: flex;
      flex-direction: column;
    }

    @include a-partir-de(md) {
      gap: 16px;
    }

    .badges {
      display: flex;
      align-items: flex-start;
      align-content: flex-start;
      gap: 8px;
      align-self: stretch;
      flex-wrap: wrap;
      margin-top: 24px;
    }

    h1 {
      font-size: 2.5rem;
      line-height: 2.875rem;
      margin: 0 0 8px;

      @include a-partir-de(md) {
        font-size: 3.5rem;
        line-height: 3.875rem;
      }
    }

    p {
      margin: 0;
      font-size: 1.25rem;
      line-height: 2rem;
      color: #3a3a3a;

      @include a-partir-de(md) {
        font-size: 1.375rem;
        line-height: 2rem;
      }
    }
  }

  .contenu-aide {
    display: flex;

    .fiche {
      display: flex;
      flex-direction: column;
      .financePar {
        margin-top: 24px;
        margin-bottom: 32px;
      }
    }
  }
</style>
