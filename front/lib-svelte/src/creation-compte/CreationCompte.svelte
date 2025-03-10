<script lang="ts">
  import Etapier from '../ui/Etapier.svelte';
  import SelectionDomaineSpecialite from './SelectionDomaineSpecialite.svelte';
  import {validationChamp} from '../directives/validationChamp';
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
  import Bouton from "../ui/Bouton.svelte";
  import {onMount} from "svelte";
  import axios from "axios";

  //TODO: recupérer informationsProfessionnelles
  let informationsProfessionnelles: InformationsProfessionnelles = {
    prenom: "prenom",
    nom: "nom",
    email: "email"
  };
  const modeleTelephone = '^0\\d{9}$';
  let departements: Departement[];


  onMount(async () => {
    const reponseDepartements = await axios.get<Departement[]>('/api/annuaire/departements');
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
        await axios.post('/api/utilisateur', formulaireInscription);
      } finally {
        enCoursEnvoi = false;
      }
      window.location.href = '/oidc/connexion';
    }
  };

  let formulaireInscription: FormulaireInscription = {
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

<div class="contenu-inscription">
  <div class="titre-contenu">
    <div class="etape">Étape {etapeCourante} sur 3</div>
    <h1>{titreEtape}</h1>
    <Etapier etapeCourante={etapeCourante-1} nombreEtapes={3}/>
  </div>
  <div class="info-champ-obligatoire requis">Champ obligatoire</div>

  {#if etapeCourante === 1}
    <Formulaire classe="formulaire-inscription" bind:this={formulaireEtape1}>
      <div class="contenu-etape">
        <div class="bloc">
          <h1>Votre identité</h1>
          <div>
            <span class="info-label">Nom :</span>
            <span class="info-valeur">{informationsProfessionnelles.nom}</span>
          </div>
          <div>
            <span class="info-label">Prénom :</span>
            <span class="info-valeur"
            >{informationsProfessionnelles.prenom}</span
            >
          </div>
          <div>
            <span class="info-label">Mail professionnel :</span>
            <span class="info-valeur">{informationsProfessionnelles.email}</span
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
              <span class="info-label">Département de votre organisation :</span
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
                bind:this={elementSelectionDepartement} />
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
              J'accepte de recevoir la lettre d'information MonServiceSécurisé.
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
              J'accepte les <a href="/cgu">conditions générales d'utilisation</a
            > de MonServiceSécurisé
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
      <Bouton type="primaire" titre="Suivant" on:click={etapeSuivante}/>
    {/if}
  </div>
</div>
