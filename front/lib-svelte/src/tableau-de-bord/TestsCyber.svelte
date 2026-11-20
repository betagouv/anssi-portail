<script lang="ts">
  import { Icone } from '@lab-anssi/ui-kit';
  import Lien from '../ui/Lien.svelte';

  type TestsCyber = {
    id: 'maturité' | 'vraiFaux' | 'exposition' | 'réflexesCyber' | 'hameçonnage';
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
      libelléLien: 'Hame\u00ADçonnage\u00a0: saurez-vous distinguez le mail légitime du faux\u00a0?',
    },
  ];
</script>

<div class="tests-cyber">
  <h2>Tests cyber</h2>
  <p class="texte-standard-md">
    Comprendre les enjeux cyber de votre organisation à l’aide de nos test simples et ludiques.
  </p>
  <ul class="tests">
    {#each testsCyber as test (test.id)}
      <li>
        <div class="statut">
          <Icone nom="checkbox-circle-line" taille="md" />
        </div>
        <img src={`/assets/icones/${test.icone}.avif`} alt={test.altIcone} class={`fond-${test.couleurIcone}`} />
        <Lien href={test.lien} libelle={test.libelléLien} />
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .tests-cyber {
    background: var(--background-default-grey);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
    padding: 1rem;

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

        .statut {
          color: var(--text-disabled-grey);
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
