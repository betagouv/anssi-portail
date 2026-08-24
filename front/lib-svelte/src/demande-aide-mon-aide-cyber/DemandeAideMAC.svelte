<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import HerosRiche from '../ui/HerosRiche.svelte';
  import MotEnExergue from '../ui/MotEnExergue.svelte';
  import { collecteLesErreurs } from '../utils/erreurApi';
  import ConfirmationCreationDemandeAide from './ConfirmationCreationDemandeAide.svelte';
  import DialogueSortieDiagnostic from './DialogueSortieDiagnostic.svelte';
  import type { CorpsAPIDemandeAide, DonneesFormulaireDemandeAide } from './DonneesFormulaireDemandeAide';
  import FoireAuxQuestions from './FoireAuxQuestions.svelte';
  import FormulaireDemandeAide from './FormulaireDemandeAide.svelte';
  import IllustrationDemandeAide from './IllustrationDemandeAide.svelte';

  let formulaireDemandeAide: FormulaireDemandeAide;
  let enSucces: boolean = false;
  let formulaireSoumis: boolean;
  let erreurs: string;
  let origine: string | null;

  let enCoursEnvoi = false;
  let dialogueSortie: DialogueSortieDiagnostic;

  onMount(() => {
    const parametres = new URLSearchParams(window.location.search);
    origine = parametres.get('mtm_campaign');
    if (!origine) {
      origine = parametres.get('origine');
    }

    const body = document.querySelector('body')!;

    const ecouteSortieSouris = (e: MouseEvent) => {
      const positionEnHauteur = e.pageY;
      if (positionEnHauteur < 250 && !enSucces) {
        body.removeEventListener('mousemove', ecouteSortieSouris);
        localStorage.setItem('sortieDiagnosticAffichee', 'true');
        dialogueSortie.affiche();
      }
    };

    if (localStorage.getItem('sortieDiagnosticAffichee') === null) {
      setTimeout(() => body.addEventListener('mousemove', ecouteSortieSouris), 7000);
    }
  });

  const soumetsFormulaire = async (e: CustomEvent<DonneesFormulaireDemandeAide>) => {
    formulaireSoumis = true;
    if (!formulaireDemandeAide.estValide()) return;

    try {
      enCoursEnvoi = true;

      const { email, cguSontValidees, emailUtilisateurMAC, entite, identifiantAidant } = e.detail;
      const corps: CorpsAPIDemandeAide = {
        ...(origine && { origine }),
        entiteAidee: {
          email,
          departement: entite.departement,
          raisonSociale: entite.nom,
          siret: entite.siret,
        },
        validationCGU: cguSontValidees,
        ...(emailUtilisateurMAC && { emailAidant: emailUtilisateurMAC }),
        ...(identifiantAidant && { identifiantAidant }),
      };
      const reponse = await axios.post('/api/mon-aide-cyber/demandes-aide', corps);
      if (reponse.status === 201) {
        enSucces = true;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        erreurs = collecteLesErreurs(e.response?.data).join('\n');
      }
    } finally {
      enCoursEnvoi = false;
    }
  };
</script>

<DialogueSortieDiagnostic bind:this={dialogueSortie} />

<HerosRiche
  badges={[
    { label: 'Rapide (1h)', accent: 'purple-glycine' },
    { label: 'Dans vos locaux ou en visio', accent: 'purple-glycine' },
  ]}
  description="Prenez votre cyberdépart&nbsp;! Profitez d’un premier diagnostic cyber gratuit accompagné par un Aidant cyber et recevez 6 recommandations prioritaires à mettre en place pour améliorer la cybersécurité de votre organisation."
  propriétésFilAriane={{ feuille: 'Diagnostic cyberdépart' }}
  variante="cafe-creme"
>
  {#snippet titreHtml()}
    Protégez votre organisation contre les <MotEnExergue motif="gribouillis">cyberattaques</MotEnExergue>
  {/snippet}
  {#snippet illustration()}
    <IllustrationDemandeAide />
  {/snippet}
</HerosRiche>

<dsfr-container class="zone-formulaire cafe-creme">
  <div class="contenu-section">
    {#if !enSucces}
      <FormulaireDemandeAide
        bind:this={formulaireDemandeAide}
        on:formulaireSoumis={soumetsFormulaire}
        {formulaireSoumis}
        {enCoursEnvoi}
        {erreurs}
        id="demande-diagnostic"
      />
    {:else}
      <ConfirmationCreationDemandeAide />
    {/if}
    <p class="texte-mention-xs">
      Ce diagnostic proposé par l'État n'est pas adapté aux particuliers et aux entreprises mono-salariées.
    </p>
  </div>
</dsfr-container>
<dsfr-container class="zone-faq">
  <div class="contenu-section">
    <h6>Questions les plus fréquentes</h6>
    <FoireAuxQuestions />
  </div>
</dsfr-container>
<dsfr-container class="zone-aide">
  <div class="contenu-section"></div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  h6 {
    margin: 0;
    margin-bottom: 24px;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.75rem;
  }

  .zone-formulaire {
    padding: 0 0 48px 0;
    --fond: var(--controle-segmente-courant-fond);
    &.cafe-creme {
      --fond: var(--background-alt-brown-cafe-creme);
      margin-top: -76px;
    }

    background: linear-gradient(to bottom, var(--fond) 0px, var(--fond) 96px, white 0, white 100%);

    .contenu-section {
      max-width: 792px;

      .texte-mention-xs {
        margin: 1rem 0 0;
      }
    }
  }

  .zone-faq {
    padding: 0 0 96px 0;

    .contenu-section {
      max-width: 792px;
    }
  }
</style>
