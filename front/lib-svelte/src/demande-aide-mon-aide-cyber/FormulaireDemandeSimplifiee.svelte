<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { clic } from '../directives/actions.svelte';
  import Alerte from '../ui/Alerte.svelte';
  import type { CouleurDeBadge } from '../ui/badge.type';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import ControleFormulaire from '../ui/ControleFormulaire.svelte';
  import Formulaire from '../ui/Formulaire.svelte';
  import SelectionOrganisation from '../ui/formulaire/SelectionOrganisation.svelte';
  import type { Organisation } from '../ui/formulaire/SelectionOrganisation.types';
  import ConfirmationCreationDemandeAide from './ConfirmationCreationDemandeAide.svelte';
  import type { CorpsAPIDemandeAide } from './DonneesFormulaireDemandeAide';

  export let origine: string;
  export let urlBase: string = '';
  export let cacheLesLiensDeRetour = false;
  export let siretAidant: string | undefined;

  let formulaire: Formulaire;
  let entite: Organisation;
  let email: string;
  let cguSontValidees: boolean;
  let enSucces: boolean = false;
  let enCoursEnvoi: boolean = false;
  let erreur: string;
  let erreurValidation = false;
  let badges: { label: string; accent: CouleurDeBadge }[] = [];

  onMount(async () => {
    const reponse = await axios.get<{
      organisationsAccompagnees: number;
      satisfaction: number;
    }>(`${urlBase}/api/diagnostic/statistiques`);
    badges = [
      {
        label: `+${reponse.data.organisationsAccompagnees} organisations accompagnées`,
        accent: 'yellow-tournesol',
      },
      {
        label: `${reponse.data.satisfaction}% de satisfaction`,
        accent: 'yellow-tournesol',
      }];
  });

  const soumetsFormulaire = async () => {
    if (!formulaire.estValide()) {
      erreurValidation = true;
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
        siretAidant,
        validationCGU: cguSontValidees,
      };
      const reponse = await axios.post(
        `${urlBase}/api/mon-aide-cyber/demandes-aide`,
        corps,
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

      <dsfr-checkbox
        id="cgu"
        name="cgu"
        status={cguSontValidees || !erreurValidation ? 'default' : 'error'}
        value={cguSontValidees}
        onvaluechanged={(e: CustomEvent) => (cguSontValidees = e.detail)}
        errorMessage="Ce champ est obligatoire. Veuillez le cocher."
        required
      >
        <span
        >J’accepte les <dsfr-link
          href="https://monaide.cyber.gouv.fr/cgu"
          label="conditions générales d’utilisation"
          blank
        ></dsfr-link>
          de MonAideCyber au nom de l’entité que je représente.
        </span>
      </dsfr-checkbox>

      <div class="envoi-demande">
        <dsfr-button
          use:clic={soumetsFormulaire}
          size="md"
          label="Envoyer ma demande"
          variantkind="primary"
          type="submit"
          centered
          disabled={enCoursEnvoi}
        ></dsfr-button>
        <p class="texte-mention-xs">
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
    <ConfirmationCreationDemandeAide
      mode="embarque"
      cacheLesLiens={cacheLesLiensDeRetour}
    />
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

    dsfr-checkbox {
      margin-bottom: 32px;
    }

    .envoi-demande {
      display: flex;
      flex-direction: column;
      gap: 8px;

      p {
        margin-bottom: 0;
      }
    }
  }

  .confirmation {
    padding-bottom: 24px;
  }
</style>
