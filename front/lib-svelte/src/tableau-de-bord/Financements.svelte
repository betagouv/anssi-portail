<script lang="ts">
  import { DsfrTag } from '@lab-anssi/ui-kit';
  import axios from 'axios';
  import { onMount } from 'svelte';
  import CarteFinancement from '../financements/CarteFinancement.svelte';
  import type { RésuméFinancement } from '../financements/financement';
  import Lien from '../ui/Lien.svelte';
  import { détecteRendu } from '../utils/rendu.svelte';
  import TitreDeSection from './TitreDeSection.svelte';

  let financements: RésuméFinancement[] = $state([]);

  onMount(async () => {
    const { data } = await axios.get<RésuméFinancement[]>('/api/financements');
    financements = data;
  });

  const rendu = détecteRendu();
  const nombreMaxDeCartesAffichées = $derived({ mobile: 1, tablette: 2, bureau: 3 }[rendu.affichageCourant]);
  const nombreDeCartesAffichées = $derived(Math.min(financements.length, nombreMaxDeCartesAffichées));
</script>

<div class="financements">
  <TitreDeSection libellé="Financements cyber" icône="money-euro-circle-line" />

  <div class="tag">
    <DsfrTag
      type="clickable"
      href="/financements"
      accent="green-emeraude"
      label={`${financements.length} disponible${financements.length > 1 ? 's' : ''}`}
    />
  </div>

  <div class="cartes">
    {#each { length: nombreDeCartesAffichées }, i}
      <CarteFinancement financement={financements[i]} />
    {/each}
  </div>

  <div class="lien">
    <Lien href="/financements" libelle="Accéder à tous mes financements" icone="arrow-right-line" iconeADroite />
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .financements {
    display: grid;
    grid-template-areas:
      'titre'
      'tag'
      'cartes'
      'lien';
    grid-row-gap: 1.5rem;

    @include a-partir-de(md) {
      grid-template-columns: max-content max-content 1fr;
      grid-template-areas:
        'titre tag lien'
        'cartes cartes cartes';
      grid-column-gap: 0.5rem;
    }

    .tag {
      grid-area: tag;
    }

    .cartes {
      --nombre-cartes: 1;

      @include a-partir-de(md) {
        --nombre-cartes: 2;
      }

      @include a-partir-de(lg) {
        --nombre-cartes: 3;
      }

      display: grid;
      grid-template-columns: repeat(var(--nombre-cartes), 1fr);
      grid-area: cartes;
      gap: 1rem;

      :global(dsfr-card) {
        min-height: unset;
      }
    }

    .lien {
      grid-area: lien;

      @include a-partir-de(md) {
        align-self: center;
        justify-self: end;
      }
    }
  }
</style>
