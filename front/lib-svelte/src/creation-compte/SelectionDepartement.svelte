<script lang="ts">
  import ChampTexte from '../ui/ChampTexte.svelte';
  import type { Departement } from './creationCompte';
  import FermetureSurClicEnDehors from '../ui/FermetureSurClicEnDehors.svelte';

  export let departements: Departement[];
  export let valeur: Departement | '' = '';

  let saisie: string;
  let minuteur: ReturnType<typeof setTimeout>;
  let dureeDebounceEnMs = 300;
  let suggestions: Departement[] = [];
  let suggestionsVisibles = false;

  const avecTemporisation = (fonction: () => Promise<void>) => {
    clearTimeout(minuteur);
    minuteur = setTimeout(async () => {
      await fonction();
    }, dureeDebounceEnMs);
  };

  const rechercheSuggestions = async () => {
    suggestions = departements.filter(
      (d) =>
        d.code.includes(saisie) ||
        d.nom.toLowerCase().includes(saisie.toLowerCase())
    );
    suggestionsVisibles = suggestions.length > 0;
  };

  export const choisisDepartement = (item: Departement) => {
    valeur = item;
    saisie = `${valeur.nom} (${valeur.code})`;
    suggestionsVisibles = false;
  };

  let suggestionsEl: HTMLDivElement;
  if (valeur) {
    saisie = `${valeur.nom} (${valeur.code})`;
  }
</script>

<div class="selection-departement conteneur">
  <ChampTexte
    id="departement"
    nom="departement"
    bind:valeur={saisie}
    on:input={() => avecTemporisation(rechercheSuggestions)}
    aideSaisie="ex : 33, Morbihan"
    on:focus={() => avecTemporisation(rechercheSuggestions)}
    autocomplete="off"
  />
  <div
    class="liste-suggestions"
    class:visible={suggestionsVisibles}
    bind:this={suggestionsEl}
  >
    {#each suggestions as suggestion (suggestion.code)}
      <div
        class="option"
        role="button"
        tabindex="0"
        on:click={() => {
          choisisDepartement(suggestion);
        }}
        on:keypress={(e) => {
          if (e.code === 'Enter') {
            choisisDepartement(suggestion);
          }
        }}
      >
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        <div>{@html suggestion.nom} ({suggestion.code})</div>
      </div>
    {/each}
  </div>
</div>

<FermetureSurClicEnDehors
  bind:doitEtreOuvert={suggestionsVisibles}
  elements={[suggestionsEl]}
/>

<style lang="scss">
  .conteneur {
    position: relative;
  }

  .liste-suggestions {
    display: none;
    position: absolute;
    background: white;
    width: calc(100% - 34px);
    /* 34px = paddings gauche et droite + bords = 2 x 16 + 2 x 1 */
    z-index: 1;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    transform: translateY(-5px);
    padding: 0 16px;
  }

  .visible {
    display: block;
    border: 1px solid var(--jaune-msc);
  }

  .option {
    padding: 4px 0;
    cursor: pointer;
  }

  .liste-suggestions {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 200px;
    overflow-scrolling: touch;
  }
</style>
