<script lang="ts">
  import ChampTexte from '../ui/ChampTexte.svelte';
  import type { Departement } from './creationCompte';
  import FermetureSurClicEnDehors from '../ui/FermetureSurClicEnDehors.svelte';

  export let departements: Departement[];
  export let valeur: Departement | '' = '';

  let saisie: string;
  let minuteur: NodeJS.Timeout;
  let dureeDebounceEnMs = 300;
  let suggestions: Departement[] = [];
  let suggestionsVisibles = false;

  const avecTemporisation = (fonction: () => Promise<any>) => {
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
    {#each suggestions as suggestion}
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
        <div>{@html suggestion.nom} ({suggestion.code})</div>
      </div>
    {/each}
  </div>
</div>

<FermetureSurClicEnDehors
  bind:doitEtreOuvert={suggestionsVisibles}
  elements={[suggestionsEl]}
/>
