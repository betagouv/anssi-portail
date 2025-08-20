<script lang="ts">
  import { onMount } from 'svelte';
  import EnteteFiltres from '../catalogue/EnteteFiltres.svelte';
  import { profilStore } from '../stores/profil.store';
  import SelectRegion from '../test-maturite/SelectRegion.svelte';
  import Hero from '../ui/Hero.svelte';
  import CarteFinancement from './CarteFinancement.svelte';
  import SqueletteCarteFinancement from './SqueletteCarteFinancement.svelte';
  import { rechercheParRegion } from './stores/rechercheParRegion.store';
  import { financementsFiltre } from './stores/financementsFiltre.store';
  import { financementsStore } from './stores/financements.store';
  import { rechercheParTypeOrganisation } from './stores/rechercheParTypeOrganisation.store';
  import { rechercheParTypeFinancement } from './stores/rechercheParTypeFinancement.store';

  let estBureau = false;
  onMount(() => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });
</script>

<Hero
  titre="Financements cyber"
  description="Bénéficiez d’aides et de subventions pour renforcer la maturité cyber de votre organisation."
  ariane={$profilStore ? undefined : 'Financements cyber'}
/>

{#if !estBureau}
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
            <SelectRegion
              bind:region={$rechercheParRegion}
              optionDefautSelectionnable
            />
          </label>
        </fieldset>
        <fieldset class="filtres organisations">
          <legend>Type d'organisation</legend>
          <ul>
            {#each $financementsFiltre.typesOrganisation as type (type)}
              <li>
                <label>
                  <input
                    type="checkbox"
                    value={type}
                    name="filtreOrganisation"
                    bind:group={$rechercheParTypeOrganisation}
                  />
                  <span class="libelle">{type}</span>
                </label>
              </li>
            {/each}
          </ul>
        </fieldset>
        <fieldset class="filtres financements">
          <legend>Type de financement</legend>
          <ul>
            {#each $financementsFiltre.typesFinancement as type (type)}
              <li>
                <label>
                  <input
                    type="checkbox"
                    value={type}
                    name="filtreFinancement"
                    bind:group={$rechercheParTypeFinancement}
                  />
                  <span class="libelle">{type}</span>
                </label>
              </li>
            {/each}
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
{/if}

<section class="financements">
  <div class="contenu-section">
    {#if estBureau}
      <div class="sommaire sommaire-deplie">
        <div class="barre-filtres">
          <EnteteFiltres />
          <fieldset class="filtres regions">
            <legend>Région</legend>
            <label class="colonne">
              <span class="libelle">Sélectionner une région</span>
              <SelectRegion
                bind:region={$rechercheParRegion}
                optionDefautSelectionnable
              />
            </label>
          </fieldset>
          <fieldset class="filtres organisations">
            <legend>Type d'organisation</legend>
            <ul>
              {#each $financementsFiltre.typesOrganisation as type (type)}
                <li>
                  <label>
                    <input
                      type="checkbox"
                      value={type}
                      name="filtreOrganisation"
                      bind:group={$rechercheParTypeOrganisation}
                    />
                    <span class="libelle">{type}</span>
                  </label>
                </li>
              {/each}
            </ul>
          </fieldset>
          <fieldset class="filtres financements">
            <legend>Type de financement</legend>
            <ul>
              {#each $financementsFiltre.typesFinancement as type (type)}
                <li>
                  <label>
                    <input
                      type="checkbox"
                      value={type}
                      name="filtreFinancement"
                      bind:group={$rechercheParTypeFinancement}
                    />
                    <span class="libelle">{type}</span>
                  </label>
                </li>
              {/each}
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
      </div>
    {/if}
    <div class="grille-cartes">
      {#if !$financementsFiltre.resultat}
        <SqueletteCarteFinancement />
        <SqueletteCarteFinancement />
        <SqueletteCarteFinancement />
        <SqueletteCarteFinancement />
        <SqueletteCarteFinancement />
      {:else}
        {#each $financementsFiltre.resultat as financement (financement.id)}
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

        @include a-partir-de(sm) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    }
  }
</style>
