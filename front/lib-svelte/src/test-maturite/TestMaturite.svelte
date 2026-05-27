<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { profilStore } from '../stores/profil.store';
  import Bouton from '../ui/Bouton.svelte';
  import Etapier from '../ui/Etapier.svelte';
  import Hero from '../ui/Hero.svelte';
  import Lien from '../ui/Lien.svelte';
  import { aseptiseHtml } from '../utils/aseptisationDuHtml';
  import IntroductionTestMaturite from './IntroductionTestMaturite.svelte';
  import PartageTest from './PartageTest.svelte';
  import ResultatsTestMaturite from './ResultatsTestMaturite.svelte';
  import { enregistreIdResultatTestPourRevendication } from './resultatTest';
  import SelectRegion from './SelectRegion.svelte';
  import SelectSecteurActivite from './SelectSecteurActivite.svelte';
  import SelectTailleOrganisation from './SelectTailleOrganisation.svelte';
  import { questionnaireStore, resultatsQuestionnaire } from './stores/questionnaire.store';
  import { etapesTestMaturite } from './TestMaturite.donnees';

  let afficheResultats = false;
  let introFaite = false;

  let secteur: string;
  let region: string;
  let tailleOrganisation: string;

  questionnaireStore.initialise();

  let reponseCourante: number;
  let codeSessionGroupe: string | undefined;
  let organisateurSession = false;

  let contenuTest: HTMLElement;

  actualiseReponseCourante();

  function actualiseReponseCourante() {
    reponseCourante = $questionnaireStore.toutesLesReponses[$questionnaireStore.questionCourante];
    if (contenuTest) contenuTest.scrollIntoView({ behavior: 'smooth' });
  }

  function valideReponse() {
    questionnaireStore.reponds(reponseCourante);
    actualiseReponseCourante();
  }

  function reviensEnArriere() {
    questionnaireStore.reviensEnArriere();
    actualiseReponseCourante();
  }

  const lisIdQuestionCourante = (q: number) => etapesTestMaturite[q].id;

  $: idQuestionCourante = lisIdQuestionCourante($questionnaireStore.questionCourante);

  type CreationTest = {
    id: string;
  };

  const utilisateurEstConnecte = () => profilStore.utilisateurEstConnecte();

  async function obtiensResultat() {
    const reponse = await axios.post<CreationTest>('/api/resultats-test', {
      reponses: $resultatsQuestionnaire,
      secteur: secteur ? secteur : null,
      region: region ? region : null,
      tailleOrganisation: tailleOrganisation ? tailleOrganisation : null,
      codeSessionGroupe,
    });
    const { id } = reponse.data;
    const estConnecte = utilisateurEstConnecte();
    if (estConnecte) {
      window.location.href = '/ma-maturite';
    } else {
      enregistreIdResultatTestPourRevendication(id);
      afficheResultats = true;
    }
  }

  async function afficheResultatSessionGroupe() {
    window.location.href = `/resultats-session-groupe?code=${codeSessionGroupe}`;
  }

  let montreProposition = false;
  $: {
    const avecPropositions = etapesTestMaturite.filter((q) => q.propositions.length > 0);
    montreProposition = $questionnaireStore.questionCourante < avecPropositions.length;
  }

  onMount(async () => {
    const parametres = new URLSearchParams(window.location.search);
    codeSessionGroupe = parametres.get('session-groupe') ?? undefined;
    if (codeSessionGroupe) {
      introFaite = true;
      try {
        await axios.get(`/api/sessions-groupe/${codeSessionGroupe}`);
      } catch {
        alert('Code de session inconnu, vous allez être redirigé');
        window.location.href = '/session-groupe';
      }
    }
    organisateurSession = parametres.has('organisateur');
  });

  $: enSessionGroupe = !!codeSessionGroupe;
  $: organisateurSessionGroupe = enSessionGroupe && organisateurSession;
</script>

{#if afficheResultats}
  <ResultatsTestMaturite />
{:else}
  <Hero
    titre="Test de maturité cyber"
    description="Obtenez en 5 minutes une évaluation indicative de la maturité cyber de votre organisation."
    ariane={enSessionGroupe ? 'Session de groupe' : 'Test de maturité cyber'}
    arianeBranche={enSessionGroupe ? { nom: 'Test de maturité cyber', lien: '/test-maturite' } : undefined}
    arianeBrancheConnectee={enSessionGroupe ? { nom: 'Maturité cyber', lien: '/ma-maturite' } : undefined}
  />

  <dsfr-container class="test-maturite">
    {#if introFaite}
      {#if organisateurSessionGroupe}
        <lab-anssi-alerte
          description="En tant qu’organisateur, vos réponses ne seront pas enregistrées ni prises en compte dans les résultats du groupe."
        ></lab-anssi-alerte>
      {/if}
      <div class="contenu-test" bind:this={contenuTest}>
        <div class="formulaire">
          <p class="etape">
            Étape {$questionnaireStore.questionCourante + 1} sur 7
          </p>
          <h5>
            {etapesTestMaturite[$questionnaireStore.questionCourante].titre}
          </h5>
          <Etapier etapeCourante={$questionnaireStore.questionCourante} nombreEtapes={7} />
          <h2>
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html aseptiseHtml(etapesTestMaturite[$questionnaireStore.questionCourante].question)}
          </h2>

          {#if montreProposition}
            <div class="propositions">
              {#each etapesTestMaturite[$questionnaireStore.questionCourante].propositions as proposition, index (proposition)}
                <label>
                  <input type="radio" bind:group={reponseCourante} value={index} />
                  <span>{index + 1}.&nbsp;{proposition}</span>
                </label>
              {/each}
            </div>

            <div class="commandes">
              <Lien href="/" libelle="Retour à l'accueil"></Lien>
              <Bouton
                desactive={$questionnaireStore.questionCourante === 0}
                libelle="Précédent"
                surClic={reviensEnArriere}
                type="secondaire"
              />
              <Bouton
                desactive={reponseCourante === null}
                libelle="Question suivante"
                surClic={valideReponse}
                type="primaire"
              />
            </div>
          {:else}
            <div class="informations-complementaires">
              <SelectSecteurActivite
                libelle="Quel est le secteur d’activité de votre organisation&nbsp;?"
                bind:secteur
              />
              <SelectRegion libelle="Dans quelle région / territoire se trouve votre organisation ?" bind:region />
              <SelectTailleOrganisation
                libelle="Quelle est la taille de votre organisation ?"
                bind:tailleOrganisation
              />

              <div class="commandes">
                <Lien href="/" libelle="Retour à l'accueil"></Lien>
                <Bouton type="secondaire" libelle="Précédent" surClic={questionnaireStore.reviensEnArriere} />
                {#if organisateurSession}
                  <Bouton type="primaire" libelle="Afficher les résultats" surClic={afficheResultatSessionGroupe} />
                {:else}
                  <Bouton type="primaire" libelle="Obtenir mon résultat" surClic={obtiensResultat} />
                {/if}
              </div>
            </div>
          {/if}
        </div>
        <div class="illustration">
          <img src="/assets/images/test-maturite/illustration-{idQuestionCourante}.svg" alt="" />
        </div>
      </div>
    {:else}
      <IntroductionTestMaturite bind:introFaite />
    {/if}
  </dsfr-container>

  {#if !introFaite}
    <PartageTest />
  {/if}
{/if}

<style lang="scss">
  .informations-complementaires {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
