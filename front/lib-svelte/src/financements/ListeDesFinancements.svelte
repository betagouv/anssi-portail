<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import Hero from '../ui/Hero.svelte';
  import CarteFinancement from './CarteFinancement.svelte';
  import type { ResumeFinancement } from './financement';
  import SqueletteCarteFinancement from './SqueletteCarteFinancement.svelte';
  import EnteteFiltres from '../catalogue/EnteteFiltres.svelte';

  export let financements: ResumeFinancement[] | undefined;
</script>

<Hero
  titre="Financements cyber"
  description="Bénéficiez d’aides et de subventions pour renforcer la maturité cyber de votre organisation."
  ariane={$profilStore ? undefined : 'Financements cyber'}
/>

<div class="sommaire sommaire-replie">
  <details>
    <summary>
      <EnteteFiltres />
    </summary>

    <div class="barre-filtres">
      <fieldset class="filtres regions">
        <legend>Région</legend>
        <label class="colonne">
          <span class="libelle">Sélectionner une région</span>
          <select name="region">
            <option value="toutes">Toutes les régions</option>
            <option value="ile-de-france">Île-de-France</option>
            <option value="auvergne-rhone-alpes">Auvergne-Rhône-Alpes</option>
            <option value="nouvelle-aquitaine">Nouvelle-Aquitaine</option>
            <option value="occitanie">Occitanie</option>
          </select>
        </label>
      </fieldset>
      <fieldset class="filtres organisations">
        <legend>Type d'organisation</legend>
        <ul>
          <li>
            <label>
              <input type="checkbox" value="TPE" />
              <span class="libelle">TPE</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" value="PME" />
              <span class="libelle">PME</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" value="ETI" />
              <span class="libelle">ETI</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" value="Collectivités" />
              <span class="libelle">Collectivités</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" value="Associations" />
              <span class="libelle">Associations</span>
            </label>
          </li>
        </ul>
      </fieldset>
      <fieldset class="filtres financements">
        <legend>Type de financement</legend>
        <ul>
          <li>
            <label>
              <input type="checkbox" value="Aide à l'innovation" />
              <span class="libelle">Aide à l'innovation</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" value="Appui à l'investissement" />
              <span class="libelle">Appui à l'investissement</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" value="Audits" />
              <span class="libelle">Audits</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" value="Formation" />
              <span class="libelle">Formation</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" value="Prestations de conseils" />
              <span class="libelle">Prestations de conseils</span>
            </label>
          </li>
        </ul>
      </fieldset>
      <lab-anssi-bouton
        on:keypress
        role="button"
        taille="md"
        tabindex={0}
        titre="Réinitialiser les filtres"
        variante="primaire"
        largeurMaximale
      ></lab-anssi-bouton>
    </div>
  </details>
</div>

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
          <CarteFinancement {financement} />
        {/each}
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .sommaire {
    .barre-filtres,
    .barre-filtres .filtres {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .barre-filtres {
      gap: 1rem;

      fieldset {
        margin: 0;
        padding: 0 0 2rem;
        border: 0;
        border-bottom: 1px solid var(--gris-clair);

        legend {
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.875rem;
          line-height: 1.25rem;
          margin-bottom: 1rem;
          padding: 0;
        }

        ul {
          display: grid;
          list-style: none;
          padding: 0;
          margin: 0;
          gap: 1rem;
        }

        label {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          cursor: pointer;

          .libelle {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          input[type='checkbox'] {
            appearance: none;
            border: 1px solid var(--noir);
            border-radius: 4px;
            width: 24px;
            height: 24px;
            margin: 0;
            cursor: pointer;

            &:checked {
              background-color: var(--jaune-msc);

              &::before {
                content: '';
                display: block;
                margin: auto;
                width: 6px;
                height: 12px;
                border-right: 2px var(--noir) solid;
                border-bottom: 2px var(--noir) solid;
                transform: translateY(2px) rotate(0.12turn);
              }
            }

            &:indeterminate {
              /* Ce style est prévu pour être cumulatif avec l'état coché */
              &::before {
                width: 9px;
                height: 10px;
                border-right: none;
                transform: none;
              }
            }
          }

          &.colonne {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
        }
      }
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

        @include a-partir-de(sm) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    }
  }
</style>
