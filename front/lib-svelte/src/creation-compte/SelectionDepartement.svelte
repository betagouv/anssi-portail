<script lang="ts">
  import { clic } from '../directives/actions.svelte';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import FermetureSurClicEnDehors from '../ui/FermetureSurClicEnDehors.svelte';
  import type { Departement } from '../ui/formulaire/SelectionOrganisation.types';

  interface Props {
    departements: Departement[];
    valeur?: Departement | '';
  }

  let { departements, valeur = $bindable() }: Props = $props();

  let saisie = $state('');
  let minuteur: ReturnType<typeof setTimeout> | undefined;
  const dureeDebounceEnMs = 300;
  let suggestions: Departement[] = $state([]);
  let suggestionsVisibles = $state(false);

  const avecTemporisation = (fonction: () => Promise<void>) => {
    clearTimeout(minuteur);
    minuteur = setTimeout(async () => {
      await fonction();
    }, dureeDebounceEnMs);
  };

  const rechercheSuggestions = async () => {
    suggestions = departements.filter(
      (d) => d.code.includes(saisie) || d.nom.toLowerCase().includes(saisie.toLowerCase())
    );
    suggestionsVisibles = suggestions.length > 0;
  };

  export const choisisDepartement = (item: Departement) => {
    valeur = item;
    saisie = `${valeur.nom} (${valeur.code})`;
    suggestionsVisibles = false;
  };

  let suggestionsEl: HTMLDivElement | undefined = $state();
  let elementsSuggestions = $derived(suggestionsEl ? [suggestionsEl] : []);

  $effect(() => {
    if (valeur) saisie = `${valeur.nom} (${valeur.code})`;
  });
</script>

<div class="selection-departement conteneur">
  <ChampTexte
    id="departement"
    libelle=""
    nom="departement"
    bind:valeur={saisie}
    oninput={() => avecTemporisation(rechercheSuggestions)}
    aideSaisie="ex : 33, Morbihan"
    autocomplete="off"
  />
  <div class="liste-suggestions" class:visible={suggestionsVisibles} bind:this={suggestionsEl}>
    {#each suggestions as suggestion (suggestion.code)}
      <div
        class="option"
        role="button"
        tabindex="0"
        use:clic={() => {
          choisisDepartement(suggestion);
        }}
      >
        <div>{suggestion.nom} ({suggestion.code})</div>
      </div>
    {/each}
  </div>
</div>

<FermetureSurClicEnDehors bind:doitEtreOuvert={suggestionsVisibles} elements={elementsSuggestions} />

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
    border: 1px solid var(--border-action-high-blue-france);
  }

  .option {
    padding: 4px 0;
    cursor: pointer;
  }

  .liste-suggestions {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 200px;
    -webkit-overflow-scrolling: touch;
  }
</style>
