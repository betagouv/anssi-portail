<script lang="ts">
  import { validationChamp } from '../directives/validationChamp';
  import type { CouleurDeBadge } from '../ui/badge.type';
  import Bouton from '../ui/Bouton.svelte';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import ControleFormulaire from '../ui/ControleFormulaire.svelte';
  import SelectionOrganisation from '../ui/formulaire/SelectionOrganisation.svelte';
  import type { Organisation } from '../ui/formulaire/SelectionOrganisation.types';
  import ConfirmationCreationDemandeAide from './ConfirmationCreationDemandeAide.svelte';

  const badges: { label: string; accent: CouleurDeBadge }[] = [
    {
      label: '+4000 organisations accompagnées',
      accent: 'yellow-tournesol',
    },
    {
      label: '92% de satisfaction',
      accent: 'yellow-tournesol',
    },
  ];
  let entite: Organisation;
  let email: string;
  let cguSontValidees: boolean;
  let enSucces: boolean = false;
</script>

{#if !enSucces}
  <form id="demande-diagnostic-simplifiee">
    <dsfr-badges-group {badges} size="sm"></dsfr-badges-group>
    <h5>Demande de diagnostic cyber</h5>
    <div class="champ recherche-organisation">
      <label class="libelle" for="entite">Recherchez votre organisation</label>
      <SelectionOrganisation
        id="entite"
        bind:valeur={entite}
        filtreDepartement={undefined}
      />
      {#if entite}
        <div>Votre entreprise : {entite.nom} ({entite.departement})</div>
      {/if}
    </div>

    <div class="champ">
      <ControleFormulaire requis={true} libelle="Email de contact">
        <ChampTexte
          id="email"
          nom="email"
          type="email"
          aideSaisie="Ex : jean.dupont@mail.com"
          requis={true}
          bind:valeur={email}
          messageErreur="Le format du mail est invalide"
        />
      </ControleFormulaire>
    </div>

    <div class="case-a-cocher cgu">
      <input
        id="cguAcceptees"
        type="checkbox"
        required
        bind:checked={cguSontValidees}
        use:validationChamp={'Ce champ est obligatoire. Veuillez le cocher.'}
      />
      <label for="cguAcceptees">
        <span class="requis">
          J'accepte les
          <dsfr-link
            class="lien"
            blank
            label="conditions générales d'utilisation"
            href="https://monaide.cyber.gouv.fr/cgu"
          ></dsfr-link>
          de MonAideCyber au nom de l’entité que je représente.
        </span>
      </label>
    </div>

    <div>
      <Bouton
        type="primaire"
        taille="md"
        titre="Envoyer ma demande"
        on:click={() => (enSucces = true)}
      />
    </div>
  </form>
{:else}
  <div class="confirmation">
    <ConfirmationCreationDemandeAide mode="embarque" />
  </div>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  form {
    display: flex;
    flex-direction: column;

    dsfr-badges-groups {
      align-self: flex-start;
    }

    h5 {
      font-size: 1.25rem;
      line-height: 1.75rem;
      margin: 0 0 24px;
      @include a-partir-de(md) {
        font-size: 1.375rem;
        line-height: 1.75rem;
      }
    }

    .champ {
      display: flex;
      flex-direction: column;
      gap: 8px;

      &.recherche-organisation {
        margin-bottom: 16px;
      }
    }

    input[type='checkbox'] {
      appearance: none;
      border: 1px solid var(--noir);
      border-radius: 4px;
      min-width: 24px;
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
    }

    .case-a-cocher {
      display: grid;
      grid-template-areas:
        'input label'
        'erreur erreur';
      gap: 8px;
      margin-bottom: 32px;
      grid-template-columns: 24px 1fr;

      input {
        grid-area: input;
      }

      label {
        grid-area: label;
      }

      :global(.erreur-champ-saisie) {
        grid-area: erreur;
        margin-top: 0;
      }
    }

    .lien {
      --text-action-high-blue-france: var(--noir);
    }

    .requis:before {
      content: '*';
      color: #e3271c;
      margin-right: 4px;
      font-size: 1rem;
    }
  }
  .confirmation {
    padding-bottom: 24px;
  }
</style>
