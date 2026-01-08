<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
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
  import FiltresMobile from '../ui/FiltresMobile.svelte';
  import FiltresBureau from '../ui/FiltresBureau.svelte';

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

  const reinitialiseFiltres = () => {
    rechercheParRegion.reinitialise();
    rechercheParTypeOrganisation.reinitialise();
    rechercheParTypeFinancement.reinitialise();
  };

  onMount(async () => {
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

<FiltresMobile filtreActif={false}>
  <FiltresFinancements {chargement} {estConnecte} />
</FiltresMobile>

<section class="financements">
  <div class="contenu-section">
    <div class="entete">
      <lab-anssi-lien
        href="https://aide.messervices.cyber.gouv.fr/fr/?chat=ouvert"
        cible="_blank"
        titre="Proposer un financement"
      ></lab-anssi-lien>
    </div>
    <div class="contenu">
      <FiltresBureau filtreActif={false}>
        <FiltresFinancements {chargement} {estConnecte} />
      </FiltresBureau>
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
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  section {
    padding: 0 var(--gouttiere) 40px;
    .contenu-section {
      padding-top: 2rem;
      padding-bottom: 3rem;

      .entete {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 2rem;
      }

      .contenu {
        display: flex;
        gap: 1.5rem;
      }

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
