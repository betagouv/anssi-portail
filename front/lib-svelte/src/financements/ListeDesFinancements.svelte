<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import EnteteFiltres from '../catalogue/EnteteFiltres.svelte';
  import { profilStore } from '../stores/profil.store';
  import Hero from '../ui/Hero.svelte';
  import CarteFinancement from './CarteFinancement.svelte';
  import FiltresFinancements from './FiltresFinancements.svelte';
  import type { ResumeFinancement } from './financement';
  import SqueletteCarteFinancement from './SqueletteCarteFinancement.svelte';
  import { financementsStore } from './stores/financements.store';
  import { financementsFiltre } from './stores/financementsFiltre.store';
  import { rechercheParRegion } from './stores/rechercheParRegion.store';
  import { rechercheParTypeFinancement } from './stores/rechercheParTypeFinancement.store';
  import { rechercheParTypeOrganisation } from './stores/rechercheParTypeOrganisation.store';

  type ReponseAxios = {
    id: number;
    nom: string;
    financeur: string;
    entitesElligibles: string[];
    typesDeFinancement: string[];
    perimetresGeographiques: string[];
    regions: string[];
  }[];

  const estConnecte = profilStore.utilisateurEstConnecte();
  let financements: ResumeFinancement[] = [];
  let chargement: boolean = true;
  let estBureau = false;

  const reinitialiseFiltres = () => {
    rechercheParRegion.reinitialise();
    rechercheParTypeOrganisation.reinitialise();
    rechercheParTypeFinancement.reinitialise();
  };

  onMount(async () => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
    try {
      chargement = true;
      const reponse = await axios.get<ReponseAxios>('/api/financements');
      financements = reponse.data;
    } catch {
      financements = [];
    } finally {
      chargement = false;
      financementsStore.initialise(financements ?? []);
    }
  });
</script>

<Hero
  titre="Financements cyber"
  description="Bénéficiez d’aides et de subventions pour renforcer la maturité cyber de votre organisation."
  ariane="Financements cyber"
/>

{#if !estBureau}
  <div class="sommaire sommaire-replie">
    <details>
      <summary>
        <EnteteFiltres />
      </summary>
      <div class="barre-filtres">
        <FiltresFinancements {chargement} {estConnecte} />
      </div>
    </details>
  </div>
{/if}

<section class="financements">
  <div class="contenu-section">
    {#if estBureau}
      <div class="sommaire sommaire-deplie">
        <div class="barre-filtres">
          <EnteteFiltres />
          <FiltresFinancements {chargement} {estConnecte} />
        </div>
      </div>
    {/if}
    <div class="grille-cartes">
      {#if chargement}
        <SqueletteCarteFinancement />
        <SqueletteCarteFinancement />
        <SqueletteCarteFinancement />
        <SqueletteCarteFinancement />
        <SqueletteCarteFinancement />
      {:else}
        {#each $financementsFiltre.resultat as financement (financement.id)}
          <CarteFinancement {financement} />
        {:else}
          <div class="aucun-resultat">
            <img
              src="/assets/images/illustration-aucun-resultat.svg"
              alt="Aucun résultat"
            />
            <h1>Désolé, aucun résultat trouvé</h1>
            <lab-anssi-bouton
              on:click={reinitialiseFiltres}
              on:keypress
              role="button"
              taille="md"
              tabindex={0}
              titre="Réinitialiser les filtres"
              variante="primaire"
              largeurMaximale
            ></lab-anssi-bouton>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .sommaire {
    .barre-filtres {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .barre-filtres {
      gap: 1rem;
    }

    &.sommaire-replie {
      z-index: 9;

      &:has(details[open]) {
        padding: 0;

        summary {
          background-color: var(--jaune-clair-msc);
          padding: 12px 16px;
        }

        .barre-filtres {
          box-sizing: border-box;
          padding: 1rem;
        }
      }
    }

    &.sommaire-deplie {
      flex: 1;
      max-width: 282px;

      :global(.chevron) {
        display: none;
      }
    }
  }

  section {
    padding: 0 var(--gouttiere) 40px;
    .contenu-section {
      display: flex;
      gap: 1.5rem;
      padding-top: 3rem;
      padding-bottom: 3rem;

      .grille-cartes {
        display: grid;
        row-gap: 24px;
        column-gap: 24px;
        flex: 1 0 0;
        grid-template-columns: 1fr;
        margin-bottom: auto;

        @include a-partir-de(sm) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .aucun-resultat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          grid-column: 1 / -1;
          text-align: center;

          h1 {
            font-size: 1.75rem;
            line-height: 2.25rem;
            @include a-partir-de(sm) {
              font-size: 2rem;
              line-height: 2.5rem;
            }
          }

          img {
            height: 250px;
          }
        }
      }
    }
  }
</style>
