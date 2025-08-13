<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { profilStore } from '../stores/profil.store';
  import Hero from '../ui/Hero.svelte';
  import CarteFinancement from './CarteFinancement.svelte';
  import type { Financement } from './financement';
  import SqueletteCarteFinancement from './SqueletteCarteFinancement.svelte';

  type ReponseAxios = {
    id: number;
    nom: string;
    financeur: string;
    entitesElligibles: string[];
    typesDeFinancement: string[];
  }[];

  let financements: Financement[] | undefined;
  onMount(async () => {
    try {
      const reponse = await axios.get<ReponseAxios>('/api/financements');
      financements = reponse.data;
    } catch {
      financements = [];
    }
  });
</script>

<Hero
  titre="Financements cyber"
  description="Bénéficiez d’aides et de subventions pour renforcer la maturité cyber de votre organisation."
  ariane={$profilStore ? undefined : 'Financements cyber'}
/>

<section class="financements">
  <div class="entete-filtres"></div>
  <div class="contenu-section">
    <div class="grille-cartes">
      {#if !financements}
        <SqueletteCarteFinancement />
        <SqueletteCarteFinancement />
        <SqueletteCarteFinancement />
        <SqueletteCarteFinancement />
        <SqueletteCarteFinancement />
      {:else}
        {#each financements as financement (financement.id)}
          <CarteFinancement
            entitesElligible={financement.entitesElligibles}
            financeur={financement.financeur}
            nom={financement.nom}
            typesDeFinancement={financement.typesDeFinancement}
          />
        {/each}
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  section {
    padding: 0 var(--gouttiere) 40px;
    .contenu-section {
      display: flex;
      gap: 1.5rem;
      padding-top: 3rem;
      padding-bottom: 3rem;

      .filtres {
        display: none;

        @include a-partir-de(md) {
          display: flex;
          flex-direction: column;
          flex: 1 0 0;
          max-width: 282px;
        }
      }

      .grille-cartes {
        display: grid;
        row-gap: 24px;
        column-gap: 24px;
        flex: 1 0 0;
        grid-template-rows:
          fit-content(100%) fit-content(100%) fit-content(100%) fit-content(
            100%
          )
          fit-content(100%) 216px;
        grid-template-columns: 1fr;

        @include a-partir-de(sm) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    }
  }
</style>
