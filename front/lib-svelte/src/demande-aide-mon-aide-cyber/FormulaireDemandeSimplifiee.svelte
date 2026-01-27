<script lang="ts">
  import axios from 'axios';
  import { validationChamp } from '../directives/validationChamp';
  import Alerte from '../ui/Alerte.svelte';
  import type { CouleurDeBadge } from '../ui/badge.type';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import ControleFormulaire from '../ui/ControleFormulaire.svelte';
  import Formulaire from '../ui/Formulaire.svelte';
  import SelectionOrganisation from '../ui/formulaire/SelectionOrganisation.svelte';
  import type { Organisation } from '../ui/formulaire/SelectionOrganisation.types';
  import ConfirmationCreationDemandeAide from './ConfirmationCreationDemandeAide.svelte';
  import type { CorpsAPIDemandeAide } from './DonneesFormulaireDemandeAide';
  import { clic } from '../directives/actions.svelte';

  const badges: { label: string; accent: CouleurDeBadge }[] = [
    {
      label: '+4900 organisations accompagnées',
      accent: 'yellow-tournesol',
    },
    {
      label: '92% de satisfaction',
      accent: 'yellow-tournesol',
    },
  ];

  export let origine: string;
  export let urlBase: string | undefined = '/api';

  let formulaire: Formulaire;
  let entite: Organisation;
  let email: string;
  let cguSontValidees: boolean;
  let enSucces: boolean = false;
  let enCoursEnvoi: boolean = false;
  let erreur: string;

  const soumetsFormulaire = async () => {
    if (!formulaire.estValide()) {
      return;
    }
    try {
      enCoursEnvoi = true;

      const corps: CorpsAPIDemandeAide = {
        origine,
        entiteAidee: {
          email,
          departement: entite.departement,
          raisonSociale: entite.nom,
          siret: entite.siret,
        },
        validationCGU: cguSontValidees,
      };
      const reponse = await axios.post(
        `${urlBase}/mon-aide-cyber/demandes-aide`,
        corps
      );
      if (reponse.status === 201) {
        enSucces = true;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        erreur = e.response?.data?.erreur;
      }
    } finally {
      enCoursEnvoi = false;
    }
  };
</script>

{#if !enSucces}
  <Formulaire id="demande-diagnostic-simplifiee" bind:this={formulaire}>
    <div class="formulaire">
      <dsfr-badges-group {badges} size="sm"></dsfr-badges-group>
      <h5>Demande de diagnostic cyber</h5>
      <div class="champ recherche-organisation">
        <label class="libelle" for="entite">Recherchez votre organisation</label
        >
        <SelectionOrganisation
          id="entite"
          bind:valeur={entite}
          filtreDepartement={undefined}
          {urlBase}
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

      <div class="envoi-demande">
        <lab-anssi-bouton
          use:clic={soumetsFormulaire}
          taille="md"
          titre="Envoyer ma demande"
          variante="primaire"
          type="submit"
          largeur-maximale
          actif={!enCoursEnvoi}
        ></lab-anssi-bouton>
        <p>
          Ce diagnostic gratuit proposé par l'État n'est pas adapté aux
          particuliers et micro-entreprises.
        </p>
      </div>
      {#if erreur}
        <Alerte
          type="ERREUR"
          titre="Une erreur est survenue"
          message={erreur}
        />
      {/if}
    </div>
  </Formulaire>
{:else}
  <div class="confirmation">
    <ConfirmationCreationDemandeAide mode="embarque" />
  </div>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .formulaire {
    display: flex;
    flex-direction: column;

    dsfr-badges-group {
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

    .envoi-demande {
      display: flex;
      flex-direction: column;
      gap: 8px;

      p {
        color: #666;
        font-size: 0.75rem;
        line-height: 1.25rem;
      }
    }
  }

  .confirmation {
    padding-bottom: 24px;
  }
</style>
