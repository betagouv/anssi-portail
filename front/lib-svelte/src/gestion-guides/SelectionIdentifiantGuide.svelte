<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { Guide } from '../catalogue/Guide.types';
  import { clic } from '../directives/actions.svelte';
  import ChampTexte2 from '../ui/ChampTexte2.svelte';

  type Props = {
    valeur: string;
  };

  let { valeur = $bindable() }: Props = $props();

  let saisieEnCours = $state(valeur);

  let listeIdentifiants: string[] = $state([]);
  let minuteur: ReturnType<typeof setTimeout>;
  let suggestions: string[] = $state([]);
  let suggestionsVisibles = $state(false);

  const avecTemporisation = (fonction: () => Promise<void>) => {
    clearTimeout(minuteur);
    minuteur = setTimeout(async () => {
      await fonction();
    }, 500);
  };

  const rechercheVague = function (source: string, terme: string) {
    const tasDeFoin = source.toLowerCase();
    let n = -1,
      lettre;
    const lettresRecherchees = terme.toLowerCase().replaceAll(/\s+/g, '-');
    for (let i = 0; (lettre = lettresRecherchees[i]); i++) {
      if (!~(n = tasDeFoin.indexOf(lettre, n + 1))) return false;
    }
    return true;
  };

  const rechercheSuggestions = async () => {
    if (saisieEnCours.length < 2) {
      suggestionsVisibles = false;
      suggestions = [];
      return;
    }

    suggestions = listeIdentifiants.filter((id) => rechercheVague(id, saisieEnCours));
    suggestionsVisibles = suggestions.length > 0;
  };

  const choisisIdentifiant = (identifiantGuide: string) => {
    valeur = saisieEnCours = identifiantGuide;
    suggestionsVisibles = false;
  };

  onMount(async () => {
    const reponseGuides = await axios.get<Guide[]>('/api/guides?mode=travail');
    listeIdentifiants = reponseGuides.data.map((guide) => guide.id).sort();
  });
</script>

<div class="conteneur-selection-guide">
  <ChampTexte2
    id="selection-id-guide"
    libelle="Identifiant du guide"
    nom="guide"
    bind:valeur={saisieEnCours}
    oninput={() => avecTemporisation(rechercheSuggestions)}
    aideSaisie="ex : guide-pour-une-formation-sur-la-cybersecurite-des-systemes-industriels"
    autocomplete="off"
  />
  <div class="liste-suggestions" class:visible={suggestionsVisibles}>
    {#each suggestions as suggestion (suggestion)}
      <div
        class="option"
        role="button"
        tabindex="0"
        use:clic={() => {
          choisisIdentifiant(suggestion);
        }}
      >
        <div>{suggestion}</div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .conteneur-selection-guide {
    position: relative;
  }

  .liste-suggestions {
    display: none;
    position: absolute;
    background: white;
    width: calc(100% - 34px);
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

  label {
    display: block;
    margin-bottom: 8px;
  }
</style>
