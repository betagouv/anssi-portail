<script lang="ts">
  import Etapier from '../ui/Etapier.svelte';
  import SelectionDomaineSpecialite from './SelectionDomaineSpecialite.svelte';
  import { validationChamp } from '../directives/validationChamp';
  import type {
    Departement,
    FormulaireInscription,
    InformationsProfessionnelles,
    Organisation,
  } from './creationCompte';
  import Formulaire from '../ui/Formulaire.svelte';
  import SelectionDepartement from './SelectionDepartement.svelte';
  import SelectionOrganisation from './SelectionOrganisation.svelte';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import ControleFormulaire from '../ui/ControleFormulaire.svelte';
  import Bouton from '../ui/Bouton.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

  let informationsProfessionnelles: InformationsProfessionnelles = {
    prenom: '',
    nom: '',
    email: '',
    organisation: { departement: '', nom: '', siret: '' },
    telephone: '',
    domainesSpecialite: [],
  };
  const modeleTelephone = '^0\\d{9}$';
  let departements: Departement[] = [];

  onMount(async () => {
    const token = new URLSearchParams(window.location.search).get('token');
    try {
      informationsProfessionnelles = (
        await axios.get<InformationsProfessionnelles>(
          `/api/informations-creation-compte?token=${token}`
        )
      ).data;
    } catch (e) {
      window.location.pathname = '/erreur';
    }
    const reponseDepartements = await axios.get<Departement[]>(
      '/api/annuaire/departements'
    );
    departements = reponseDepartements.data;
  });

  let etapeCourante = 1;

  $: titreEtape = [
    'Vos informations professionnelles',
    'Vos informations complémentaires',
    'Vos consentements',
  ][etapeCourante - 1];

  let formulaireEtape1: Formulaire;
  let formulaireEtape2: Formulaire;
  let formulaireEtape3: Formulaire;

  $: tousFormulaires = [formulaireEtape1, formulaireEtape2, formulaireEtape3];
  $: formulaireCourant = tousFormulaires[etapeCourante - 1];

  const etapePrecedente = () => {
    if (etapeCourante > 1) etapeCourante--;
  };
  const etapeSuivante = () => {
    if (formulaireCourant.estValide() && etapeCourante < 3) {
      etapeCourante++;
    }
  };

  let enCoursEnvoi = false;

  const valide = async () => {
    if (formulaireCourant.estValide()) {
      try {
        enCoursEnvoi = true;
        await axios.post('/api/utilisateurs', formulaireInscription);
      } finally {
        enCoursEnvoi = false;
      }
      window.location.href = '/oidc/connexion';
    }
  };

  let formulaireInscription: FormulaireInscription;
  $: formulaireInscription = {
    prenom: informationsProfessionnelles.prenom,
    nom: informationsProfessionnelles.nom,
    email: informationsProfessionnelles.email,
    siretEntite: informationsProfessionnelles.organisation?.siret,
    telephone: informationsProfessionnelles.telephone,
    postes: informationsProfessionnelles.domainesSpecialite || [],
    estimationNombreServices: null,
    agentConnect: true,
    cguAcceptees: false,
    infolettreAcceptee: false,
    transactionnelAccepte: true,
  };

  let departement: Departement;
  let organisation: Organisation;
  $: {
    formulaireInscription.siretEntite =
      informationsProfessionnelles.organisation?.siret || organisation?.siret;
  }

  let elementSelectionDepartement: SelectionDepartement;
  const modifieDepartementApresChoixOrganisation = (
    e: CustomEvent<Organisation>
  ) => {
    const d = departements.find((d) => d.code === e.detail.departement);
    if (d) {
      elementSelectionDepartement.choisisDepartement(d);
    }
  };
</script>

<div class="creation-compte">
  <div class="contenu-inscription">
    <div class="titre-contenu">
      <div class="etape">Étape {etapeCourante} sur 3</div>
      <h1>{titreEtape}</h1>
      <Etapier etapeCourante={etapeCourante - 1} nombreEtapes={3} />
    </div>
    <div class="info-champ-obligatoire requis">Champ obligatoire</div>

    {#if etapeCourante === 1}
      <Formulaire classe="formulaire-inscription" bind:this={formulaireEtape1}>
        <div class="contenu-etape">
          <div class="bloc">
            <h1>Votre identité</h1>
            <div>
              <span class="info-label">Nom :</span>
              <span class="info-valeur">{informationsProfessionnelles.nom}</span
              >
            </div>
            <div>
              <span class="info-label">Prénom :</span>
              <span class="info-valeur"
                >{informationsProfessionnelles.prenom}</span
              >
            </div>
            <div>
              <span class="info-label">Mail professionnel :</span>
              <span class="info-valeur"
                >{informationsProfessionnelles.email}</span
              >
            </div>
          </div>
          {#if informationsProfessionnelles.organisation}
            <div class="bloc">
              <h1>Votre organisation</h1>
              <div>
                <span class="info-label">Dénomination légale :</span>
                <span class="info-valeur"
                  >{informationsProfessionnelles.organisation.nom}</span
                >
              </div>
              <div>
                <span class="info-label">SIRET :</span>
                <span class="info-valeur"
                  >{informationsProfessionnelles.organisation.siret}</span
                >
              </div>
              <div>
                <span class="info-label"
                  >Département de votre organisation :</span
                >
                <span class="info-valeur"
                  >{informationsProfessionnelles.organisation.departement}</span
                >
              </div>
            </div>
          {/if}
        </div>
      </Formulaire>
    {/if}

    {#if etapeCourante === 2}
      <Formulaire classe="formulaire-inscription" bind:this={formulaireEtape2}>
        <div class="contenu-etape">
          {#if !informationsProfessionnelles.organisation}
            <div class="bloc bloc-avec-separateur champs-saisie">
              <h1>Votre organisation</h1>
              <ControleFormulaire
                requis={true}
                libelle="Département de votre organisation"
              >
                <SelectionDepartement
                  bind:valeur={departement}
                  {departements}
                  bind:this={elementSelectionDepartement}
                />
              </ControleFormulaire>
              <ControleFormulaire
                requis={true}
                libelle="Nom ou SIRET de votre organisation"
              >
                <SelectionOrganisation
                  bind:valeur={organisation}
                  filtreDepartement={departement}
                  on:organisationChoisie={modifieDepartementApresChoixOrganisation}
                />
              </ControleFormulaire>
            </div>
          {/if}

          <div class="bloc bloc-avec-separateur champs-saisie">
            <h1>Votre identité</h1>
            <ControleFormulaire
              libelle="Téléphone"
              sousTitre="Pour bénéficier d'un accompagement personnalisé"
            >
              <ChampTexte
                id="telephone"
                nom="telephone"
                aideSaisie="Ex : 0XXXXXXXXX"
                modele={modeleTelephone}
                bind:valeur={formulaireInscription.telephone}
                messageErreur="Le numéro de téléphone doit respecter le format 0000000000."
              />
            </ControleFormulaire>
            <ControleFormulaire requis={true} libelle="Domaine de spécialité">
              <SelectionDomaineSpecialite
                id="domaine-specialite"
                requis
                bind:valeurs={formulaireInscription.postes}
              />
            </ControleFormulaire>
          </div>
        </div>
      </Formulaire>
    {/if}

    {#if etapeCourante === 3}
      <Formulaire classe="formulaire-inscription" bind:this={formulaireEtape3}>
        <div class="contenu-etape">
          <div class="bloc">
            <div class="case-a-cocher">
              <input
                id="infolettreAcceptee"
                type="checkbox"
                bind:checked={formulaireInscription.infolettreAcceptee}
                name="infolettreAcceptee"
              />
              <label for="infolettreAcceptee">
                J'accepte de recevoir la lettre d'information MesServicesCyber.
              </label>
            </div>
            <div class="case-a-cocher cgu">
              <input
                id="cguAcceptees"
                type="checkbox"
                bind:checked={formulaireInscription.cguAcceptees}
                name="cguAcceptees"
                required
                use:validationChamp={'Ce champ est obligatoire. Veuillez le cocher.'}
              />
              <label for="cguAcceptees" class="requis">
                J'accepte les <a href="/cgu">
                  conditions générales d'utilisation
                </a> de MesServicesCyber
              </label>
            </div>
          </div>
        </div>
      </Formulaire>
    {/if}

    <div class="actions">
      <Bouton
        type="secondaire"
        titre="Précédent"
        on:click={etapePrecedente}
        actif={etapeCourante > 1}
      />
      {#if etapeCourante === 3}
        <Bouton
          type="primaire"
          titre="Valider"
          on:click={valide}
          {enCoursEnvoi}
        />
      {:else}
        <Bouton type="primaire" titre="Suivant" on:click={etapeSuivante} />
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive.scss' as *;

  :global(.creation-compte .actions button) {
    padding: 8px 16px;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
  }

  input {
    box-sizing: border-box;
  }

  .creation-compte {
    @include a-partir-de(md) {
      background-color: #eee;
      padding: 64px;
    }
  }

  .titre-contenu {
    border-bottom: solid 1px var(--liseres-fonce);
  }

  .contenu-inscription {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 32px 16px;
    background-color: white;
    text-align: left;
    color: #000;
    @include a-partir-de(sm) {
      padding: 32px 64px;
    }
    @include a-partir-de(md) {
      margin: 0 auto;
      max-width: 800px;
    }
  }

  .contenu-inscription h1 {
    font-size: 1.375rem;
    font-weight: bold;
    margin: 0 0 12px;
    padding: 0;
  }

  .info-valeur {
    font-weight: bold;
  }

  .bloc h1 {
    margin-bottom: 16px;
  }

  .bloc-avec-separateur {
    padding-bottom: 8px;
    border-bottom: solid 1px var(--liseres-fonce);
  }

  .bloc div {
    margin-bottom: 8px;
  }

  .etape {
    color: var(--texte-clair);
    font-size: 0.875rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
  }

  .contenu-etape {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .info-champ-obligatoire {
    text-align: right;
    font-size: 0.75rem;
    padding-bottom: 32px;
  }

  .requis:before {
    content: '*';
    color: #e3271c;
    margin-right: 4px;
    font-size: 1rem;
  }

  label {
    font-weight: normal;
    margin: 0;
  }

  .case-a-cocher {
    background-color: #f6f6f6;
    border-radius: 6px;
    padding: 16px;
  }

  input[type='checkbox'] {
    transform: none;
  }

  .case-a-cocher.cgu {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .cgu #cguAcceptees {
    order: -1;
  }

  .cgu label {
    order: -1;
    a {
      display: inline-block;
    }
  }

  :global(.creation-compte .case-et-label),
  .case-a-cocher {
    display: flex;
    gap: 8px;
  }

  :global(.creation-compte input[type='checkbox']) {
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
  }
</style>
