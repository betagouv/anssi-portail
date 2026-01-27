<script lang="ts">
  import ChampTexte from '../ChampTexte.svelte';
  import { createEventDispatcher, tick } from 'svelte';
  import { validationChamp } from '../../directives/validationChamp';
  import axios from 'axios';
  import type {
    Organisation,
    Departement,
  } from './SelectionOrganisation.types.ts';

  type ReponseApiAnnuaireOrganisations = {
    suggestions: Organisation[];
  };
  type OrganisationAvecLabel = Organisation & {
    label: string;
  };

  export let filtreDepartement: Departement | undefined;
  export let valeur: Organisation | undefined;
  export let id: string = '';
  export let urlBase: string | undefined;

  let saisie: string;
  let minuteur: ReturnType<typeof setTimeout>;
  let dureeDebounceEnMs = 300;
  let suggestions: OrganisationAvecLabel[] = [];
  let suggestionsVisibles = false;
  let champValeur: HTMLInputElement;

  const avecTemporisation = (fonction: () => Promise<void>) => {
    clearTimeout(minuteur);
    minuteur = setTimeout(async () => {
      await fonction();
    }, dureeDebounceEnMs);
  };

  const construisLabel = (organisation: Organisation) => {
    const siret = organisation.siret;

    const siretFormatte =
      siret &&
      `${siret.substring(0, 3)} ${siret.substring(3, 6)} ${siret.substring(
        6,
        9
      )} ${siret.substring(9, 14)}`;
    return `(${organisation.departement}) ${organisation.nom} - ${siretFormatte}`;
  };

  const uneSuggestion = (organisation: Organisation): OrganisationAvecLabel => {
    return { ...organisation, label: construisLabel(organisation) };
  };

  const rechercheSuggestions = async () => {
    if (saisie.length === 0) {
      valeur = undefined;
    }
    if (saisie.length < 2) {
      suggestionsVisibles = false;
      suggestions = [];
      return;
    }
    const reponse = await axios.get<ReponseApiAnnuaireOrganisations>(
      `${urlBase}/api/annuaire/organisations`,
      {
        params: {
          recherche: saisie,
          departement: filtreDepartement?.code,
        },
      }
    );

    suggestions = reponse?.data?.suggestions?.map(uneSuggestion) ?? [];
    suggestionsVisibles = suggestions.length > 0;
  };

  const envoiEvenement = createEventDispatcher<{
    organisationChoisie: Organisation;
  }>();

  const choisisOrganisation = (item: OrganisationAvecLabel) => {
    valeur = item;
    saisie = item.label;
    suggestionsVisibles = false;
    envoiEvenement('organisationChoisie', item);
  };

  $: {
    if (valeur) {
      tick().then(() => champValeur.dispatchEvent(new Event('input')));
    }
  }

  saisie = valeur ? construisLabel(valeur) : '';
</script>

<div class="conteneur-selection-organisation">
  <ChampTexte
    {id}
    nom="organisation"
    bind:valeur={saisie}
    on:input={() => avecTemporisation(rechercheSuggestions)}
    aideSaisie="ex : 13261762000010, Agglomération de Mansart, Société Y"
    autocomplete="off"
  />
  <div class="liste-suggestions" class:visible={suggestionsVisibles}>
    {#each suggestions as suggestion (suggestion.siret)}
      <div
        class="option"
        role="button"
        tabindex="0"
        on:click={() => {
          choisisOrganisation(suggestion);
        }}
        on:keypress={(e) => {
          if (e.code === 'Enter') {
            choisisOrganisation(suggestion);
          }
        }}
      >
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        <div>{@html suggestion.label}</div>
      </div>
    {/each}
  </div>
  <input
    type="text"
    bind:this={champValeur}
    bind:value={saisie}
    class="valeur-cache"
    required
    use:validationChamp={'Ce champ est obligatoire. Veuillez sélectionner une entrée.'}
  />
</div>

<style lang="scss">
  .conteneur-selection-organisation {
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

  .valeur-cache {
    display: none;
  }
</style>
