<script lang="ts">
  import { Icone } from '@lab-anssi/ui-kit';
  import axios from 'axios';
  import { onMount } from 'svelte';

  import type { IdNiveau } from '@niveaux-maturite/NiveauxMaturite.type';
  import Lien from '@ui/Lien.svelte';

  import TuileNiveauMaturité from './TuileNiveauMaturite.svelte';

  type IdMiniTest = 'maturité' | 'vraiFaux' | 'exposition' | 'réflexesCyber' | 'hameçonnage';
  type RéalisationMiniTests = Record<IdMiniTest, { réalisé: boolean }> & {
    maturité: { réalisé: boolean; niveau: IdNiveau };
  };

  type TestsCyber = {
    id: IdMiniTest;
    icone: string;
    altIcone: string;
    couleurIcone: 'green-bourgeon' | 'pink-macaron' | 'blue-cumulus' | 'purple-glycine' | 'yellow-moutarde';
    lien: string;
    libelléLien: string;
  };

  const testsCyber: TestsCyber[] = [
    {
      id: 'maturité',
      icone: 'plante',
      altIcone: 'Plante',
      couleurIcone: 'green-bourgeon',
      lien: '/test-maturite',
      libelléLien: 'Quelle est la maturité cyber de votre organisation\u00a0?',
    },
    {
      id: 'vraiFaux',
      icone: 'emoticone-penseur',
      altIcone: 'Émoticône penseur',
      couleurIcone: 'pink-macaron',
      lien: '/vrai-faux',
      libelléLien: 'Cyber\u00ADattaques\u00a0: saurez-vous démêler le vrai du faux\u00a0?',
    },
    {
      id: 'exposition',
      icone: 'emoticone-anxieux-sueur',
      altIcone: 'Émoticône anxieux en sueur',
      couleurIcone: 'blue-cumulus',
      lien: '/exposition',
      libelléLien: 'Quels types de cyber\u00ADattaques peuvent cibler mon organisation\u00a0?',
    },
    {
      id: 'réflexesCyber',
      icone: 'emoticone-alerte',
      altIcone: 'Émoticône alerte',
      couleurIcone: 'purple-glycine',
      lien: '/reflexes-cyber-en-ligne',
      libelléLien: 'Quels types de cyber\u00ADattaques peuvent cibler mon organisation\u00a0?',
    },
    {
      id: 'hameçonnage',
      icone: 'canne-a-peche',
      altIcone: 'Canne à pêche',
      couleurIcone: 'yellow-moutarde',
      lien: '/hameconnage',
      libelléLien: 'Hame\u00ADçonnage\u00a0: saurez-vous distinguer le mail légitime du faux\u00a0?',
    },
  ];

  let réalisationMiniTests: RéalisationMiniTests | undefined = $state(undefined);

  onMount(async () => {
    const { data } = await axios.get<RéalisationMiniTests>('/api/mes-mini-tests');
    réalisationMiniTests = data;
  });
</script>

<div class="tests-cyber">
  <div class="section">
    <h2>Tests cyber</h2>
    <p class="texte-standard-md">
      Comprendre les enjeux cyber de votre organisation à l’aide de nos test simples et ludiques.
    </p>
    <ul>
      {#each testsCyber as test (test.id)}
        <li>
          {#if réalisationMiniTests && réalisationMiniTests[test.id].réalisé}
            <div class="statut realise">
              <Icone nom="checkbox-circle-fill" taille="md" />
              <span class="sr-only">mini-test réalisé</span>
            </div>
          {:else}
            <div class="statut">
              <Icone nom="checkbox-circle-line" taille="md" />
              <span class="sr-only">mini-test non réalisé</span>
            </div>
          {/if}
          <img src={`/assets/icones/${test.icone}.avif`} alt={test.altIcone} class={`fond-${test.couleurIcone}`} />
          <Lien href={test.lien} libelle={test.libelléLien} />
        </li>
      {/each}
    </ul>
  </div>
  {#if réalisationMiniTests && réalisationMiniTests['maturité'].réalisé}
    <div class="section maturite">
      <h4>Maturité cyber de votre organisation</h4>
      <TuileNiveauMaturité niveau={réalisationMiniTests.maturité.niveau} />

      <Lien libelle="Accéder aux détails" href="/ma-maturite" icone="arrow-right-line" iconeADroite />
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  .tests-cyber {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @include a-partir-de(md) {
      display: grid;
      grid-template-columns: 3fr 1fr;

      &:not(:has(> .maturite)) {
        grid-template-columns: 1fr;
      }
    }

    .section {
      flex: 1;
      background: var(--background-default-grey);
      box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
      padding: 1rem;

      @include a-partir-de(lg) {
        padding: 2rem;
      }

      &.maturite {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        h4 {
          margin-bottom: 0;
        }
      }
    }

    h2 {
      margin-bottom: 1rem;
    }

    ul {
      padding: 0;
      margin: 2rem 0 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      li {
        padding: 0;
        margin: 0;
        list-style-type: none;
        display: flex;
        gap: 0.75rem;
        align-items: center;

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .statut {
          color: var(--text-disabled-grey);

          &.realise {
            color: var(--text-default-success);
          }
        }

        img {
          background-color: var(--couleur-icone);
          padding: 0.75rem;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 0.5rem;

          &.fond-green-bourgeon {
            --couleur-icone: var(--background-alt-green-bourgeon);
          }
          &.fond-blue-cumulus {
            --couleur-icone: var(--background-alt-blue-cumulus);
          }
          &.fond-pink-macaron {
            --couleur-icone: var(--background-alt-pink-macaron);
          }
          &.fond-purple-glycine {
            --couleur-icone: var(--background-alt-purple-glycine);
          }
          &.fond-yellow-moutarde {
            --couleur-icone: var(--background-alt-yellow-moutarde);
          }
        }
      }
    }
  }
</style>
