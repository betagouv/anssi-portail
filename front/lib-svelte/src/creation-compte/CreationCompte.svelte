<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Bouton from '../ui/Bouton.svelte';
  import CaseACocher from '../ui/CaseACocher.svelte';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import ControleFormulaire from '../ui/ControleFormulaire.svelte';
  import Etapier from '../ui/Etapier.svelte';
  import Formulaire from '../ui/Formulaire.svelte';
  import SelectionOrganisation from '../ui/formulaire/SelectionOrganisation.svelte';
  import type { Departement, Organisation } from '../ui/formulaire/SelectionOrganisation.types.js';
  import Lien from '../ui/Lien.svelte';
  import type { FormulaireInscription, InformationsProfessionnelles } from './creationCompte';
  import SelectionDepartement from './SelectionDepartement.svelte';
  import SelectionDomaineSpecialite from './SelectionDomaineSpecialite.svelte';

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

  let token: string | undefined;

  onMount(async () => {
    token = new URLSearchParams(window.location.search).get('token') ?? undefined;
    try {
      informationsProfessionnelles = (
        await axios.get<InformationsProfessionnelles>(`/api/informations-creation-compte?token=${token}`)
      ).data;
    } catch {
      window.location.pathname = '/erreur';
    }
    const reponseDepartements = await axios.get<Departement[]>('/api/annuaire/departements');
    departements = reponseDepartements.data;
  });

  let etapeCourante = 1;

  $: titreEtape = ['Vos informations professionnelles', 'Vos informations complémentaires', 'Vos consentements'][
    etapeCourante - 1
  ];

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
        await axios.post('/api/utilisateurs', {
          ...formulaireInscription,
          token,
        });
        window.location.href = '/oidc/connexion';
      } catch {
        enCoursEnvoi = false;
      }
    }
  };

  let domainesSpecialite = informationsProfessionnelles.domainesSpecialite || [];
  let formulaireInscription: FormulaireInscription;
  $: formulaireInscription = {
    siretEntite: informationsProfessionnelles.organisation?.siret,
    telephone: informationsProfessionnelles.telephone,
    domainesSpecialite,
    cguAcceptees: false,
    infolettreAcceptee: false,
    pixelDeSuiviAccepté: false,
  };

  let departement: Departement;
  let organisation: Organisation;
  $: {
    formulaireInscription.siretEntite = informationsProfessionnelles.organisation?.siret || organisation?.siret;
  }

  let elementSelectionDepartement: SelectionDepartement;
  const modifieDepartementApresChoixOrganisation = (e: CustomEvent<Organisation>) => {
    const d = departements.find((d) => d.code === e.detail.departement);
    if (d) {
      elementSelectionDepartement.choisisDepartement(d);
    }
  };
</script>

<div class="creation-compte">
  <div class="contenu-inscription">
    <Etapier {etapeCourante} nombreEtapes={3} titreEtapeCourante={titreEtape} cacheTitreEtapeSuivante />
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
              <span class="info-valeur">{informationsProfessionnelles.prenom}</span>
            </div>
            <div>
              <span class="info-label">Mail professionnel :</span>
              <span class="info-valeur">{informationsProfessionnelles.email}</span>
            </div>
          </div>
          {#if informationsProfessionnelles.organisation}
            <div class="bloc">
              <h1>Votre organisation</h1>
              <div>
                <span class="info-label">Dénomination légale :</span>
                <span class="info-valeur">{informationsProfessionnelles.organisation.nom}</span>
              </div>
              <div>
                <span class="info-label">SIRET :</span>
                <span class="info-valeur">{informationsProfessionnelles.organisation.siret}</span>
              </div>
              <div>
                <span class="info-label">Département de votre organisation :</span>
                <span class="info-valeur">{informationsProfessionnelles.organisation.departement}</span>
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
              <ControleFormulaire requis={true} libelle="Département de votre organisation">
                <SelectionDepartement
                  bind:valeur={departement}
                  {departements}
                  bind:this={elementSelectionDepartement}
                />
              </ControleFormulaire>
              <ControleFormulaire requis={true} libelle="Nom ou SIRET de votre organisation">
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
            <div class="telephone">
              <ChampTexte
                aideSaisie="Ex : 0XXXXXXXXX"
                id="telephone"
                libelle="Téléphone"
                messageErreur="Le numéro de téléphone doit respecter le format 0000000000."
                modele={modeleTelephone}
                nom="telephone"
                sousTitre="Pour bénéficier d'un accompagement personnalisé"
                bind:valeur={formulaireInscription.telephone}
              />
            </div>
            <ControleFormulaire requis={true} libelle="Domaine de spécialité">
              <SelectionDomaineSpecialite id="domaine-specialite" requis bind:valeurs={domainesSpecialite} />
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
              <CaseACocher
                id="infolettreAcceptee"
                nom="infolettreAcceptee"
                libelle="J'accepte de recevoir la lettre d'information MesServicesCyber."
                bind:coche={formulaireInscription.infolettreAcceptee}
              ></CaseACocher>
            </div>
            <div class="case-a-cocher">
              <CaseACocher id="cguAcceptees" nom="cguAcceptees" bind:coche={formulaireInscription.cguAcceptees} requis>
                <span class="requis">
                  J'accepte les&nbsp;<Lien href="/cgu" libelle=" conditions générales d'utilisation" neutre></Lien>
                  de MesServicesCyber</span
                >
              </CaseACocher>
            </div>
            <div class="case-a-cocher">
              <CaseACocher
                id="pixelDeSuiviAccepte"
                nom="pixelDeSuiviAccepte"
                libelle="J'accepte que l'ouverture des emails qui me sont adressés puisse être mesurée afin d'en améliorer la pertinence."
                bind:coche={formulaireInscription.pixelDeSuiviAccepté}
              ></CaseACocher>
            </div>
          </div>
        </div>
      </Formulaire>
    {/if}

    <div class="actions">
      <Bouton type="secondaire" libelle="Précédent" surClic={etapePrecedente} desactive={etapeCourante <= 1} />
      {#if etapeCourante === 3}
        <Bouton type="primaire" libelle="Valider" surClic={valide} desactive={enCoursEnvoi} />
      {:else}
        <Bouton type="primaire" libelle="Suivant" surClic={etapeSuivante} />
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive.scss' as *;

  :global(.creation-compte .actions) {
    margin-top: 32px;
  }

  :global(.creation-compte .actions button) {
    padding: 8px 16px;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
  }

  .creation-compte {
    @include a-partir-de(md) {
      background-color: #eee;
      padding: 64px;
    }
  }

  .contenu-inscription {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 32px 16px;
    background-color: var(--background-default-grey);
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

  .bloc .telephone {
    margin-bottom: 2rem;
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
    padding-bottom: 64px;
  }

  .requis:before {
    content: '*';
    color: var(--text-default-error);
    margin-right: 4px;
    font-size: 1rem;
  }

  .case-a-cocher {
    background-color: #f6f6f6;
    border-radius: 6px;
    padding: 16px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }
</style>
