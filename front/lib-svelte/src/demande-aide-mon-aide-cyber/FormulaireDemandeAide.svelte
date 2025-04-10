<script lang="ts">
  import Bouton from '../ui/Bouton.svelte';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import SelectionOrganisation from '../ui/formulaire/SelectionOrganisation.svelte';
  import ControleFormulaire from '../ui/ControleFormulaire.svelte';
  import Formulaire from '../ui/Formulaire.svelte';
  import type { Organisation } from '../ui/formulaire/SelectionOrganisation.types';
  import { createEventDispatcher } from 'svelte';
  import type { DonneesFormulaireDemandeAide } from './DonneesFormulaireDemandeAide';
  import { validationChamp } from '../directives/validationChamp';
  import Alerte from '../ui/Alerte.svelte';

  let formulaire: Formulaire;
  export let enCoursEnvoi: boolean;
  export let formulaireSoumis: boolean;

  export let erreurs: string;

  let entite: Organisation;
  let email: string;
  let estEnRelationAvecUnUtilisateur: boolean;
  let emailAidant: string;
  let cguSontValidees: boolean;

  export const estValide = () => formulaire.estValide();

  const emets = createEventDispatcher<{
    formulaireSoumis: DonneesFormulaireDemandeAide;
  }>();

  const soumetsFormulaire = () => {
    emets('formulaireSoumis', {
      entite,
      email,
      ...(estEnRelationAvecUnUtilisateur && { emailAidant }),
      cguSontValidees,
    });
  };
</script>

<Formulaire classe="carte-formulaire" bind:this={formulaire}>
  <div class="champ">
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

  {#if entite}
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

    <div class="champ champ-radios">
      <ControleFormulaire
        requis
        libelle="Êtes-vous déjà en contact avec un Aidant cyber ou un prestataire ?"
      >
        <div>
          <label>
            <input
              name="estEnRelationAvecUnUtilisateur"
              type="radio"
              bind:group={estEnRelationAvecUnUtilisateur}
              value={false}
            />
            <span>Non</span>
          </label>
          <label>
            <input
              name="estEnRelationAvecUnUtilisateur"
              type="radio"
              bind:group={estEnRelationAvecUnUtilisateur}
              value={true}
            />
            <span>Oui</span>
          </label>
        </div>
        {#if estEnRelationAvecUnUtilisateur === undefined && formulaireSoumis}
          <span class="erreur-champ-saisie"
            >Ce champ est obligatoire. Veuillez le cocher.</span
          >
        {/if}
      </ControleFormulaire>
    </div>

    {#if estEnRelationAvecUnUtilisateur}
      <div class="champ">
        <ControleFormulaire
          requis={true}
          libelle="Email de l'Aidant ou du prestataire"
        >
          <ChampTexte
            bind:valeur={emailAidant}
            nom="emailAidant"
            id="emailAidant"
            requis={true}
            type="email"
            aideSaisie="Ex: jean.dupont@email.com"
            messageErreur="Le format du mail est invalide"
          />
        </ControleFormulaire>
      </div>
    {/if}

    <div class="case-a-cocher cgu">
      <input
        id="cguAcceptees"
        type="checkbox"
        required
        bind:checked={cguSontValidees}
        use:validationChamp={'Ce champ est obligatoire. Veuillez le cocher.'}
      />
      <label for="cguAcceptees" class="requis">
        J'accepte les <a class="lien" href="https://monaide.cyber.gouv.fr/cgu" target="_blank">conditions générales d'utilisation</a> de MonAideCyber au
        nom de l’entité que je représente.
      </label>
    </div>

    <div>
      <Bouton
        type="primaire"
        titre="Envoyer ma demande de diagnostic"
        on:click={soumetsFormulaire}
        {enCoursEnvoi}
      />
    </div>

    {#if erreurs}
      <Alerte type="ERREUR" titre="Une erreur est survenue" message={erreurs} />
    {/if}
  {/if}
</Formulaire>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  :global(.carte-formulaire) {
    max-width: 100%;
    border-radius: 8px;
    border: 1px solid
      var(--Couleurs-Clair-Decisions-Border-_border-default-grey, #ddd);
    background: #fff;
    padding: 48px 24px 72px 24px;

    margin-top: -75px;

    display: flex;
    flex-direction: column;
    gap: 32px;

    @include a-partir-de(md) {
      padding: 48px 80px 72px 80px;
    }

    @include a-partir-de(lg) {
      padding: 48px 80px 72px 80px;
    }
  }

  .libelle {
    font-size: 20px;
    font-weight: bold;
  }

  .champ {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .champ.champ-radios {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .erreur-champ-saisie {
      display: flex;
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

    &:indeterminate {
      &::before {
        width: 9px;
        height: 10px;
        border-right: none;
        transform: none;
      }
    }
  }

  .case-a-cocher {
    display: grid;
    grid-template-areas:  'input label'
                          'erreur erreur';
    gap: 8px;

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

  input[type='checkbox'] {
    transform: none;
  }

  .lien {
    display: inline-flex;
  }

  .requis:before {
    content: '*';
    color: #e3271c;
    margin-right: 4px;
    font-size: 1rem;
  }

</style>
