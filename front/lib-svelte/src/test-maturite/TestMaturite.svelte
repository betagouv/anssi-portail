<script lang="ts">
  import { aseptiseHtml } from '$plateforme/aseptisationDuHtml';
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { calculeIdNiveau } from '../niveaux-maturite/calculeIdNiveau';
  import { profilStore } from '../stores/profil.store';
  import Bouton from '../ui/Bouton.svelte';
  import Etapier from '../ui/Etapier.svelte';
  import Lien from '../ui/Lien.svelte';
  import IntroductionTestMaturite from './IntroductionTestMaturite.svelte';
  import ResultatsTestMaturite from './ResultatsTestMaturite.svelte';
  import { enregistreIdResultatTestPourRevendication } from './resultatTest';
  import SelectRegion from './SelectRegion.svelte';
  import SelectSecteurActivite from './SelectSecteurActivite.svelte';
  import SelectTailleOrganisation from './SelectTailleOrganisation.svelte';
  import { questionnaireStore, resultatsQuestionnaire } from './stores/questionnaire.store';
  import { etapesTestMaturite } from './TestMaturite.donnees';

  let afficheResultats = $state(false);
  let introFaite = $state(false);

  let secteur = $state('');
  let region = $state('');
  let tailleOrganisation = $state('');

  questionnaireStore.initialise();

  let reponseCourante: number | null = $state(null);
  let codeSessionGroupe: string | undefined = $state();
  let organisateurSession = $state(false);

  let contenuTest: HTMLElement | undefined = $state();

  actualiseReponseCourante();

  function actualiseReponseCourante() {
    reponseCourante = $questionnaireStore.toutesLesReponses[$questionnaireStore.questionCourante];
    if (contenuTest) contenuTest.scrollIntoView({ behavior: 'smooth' });
  }

  function valideReponse() {
    if (reponseCourante === null) return;
    questionnaireStore.reponds(reponseCourante);
    actualiseReponseCourante();
  }

  function reviensEnArriere() {
    questionnaireStore.reviensEnArriere();
    actualiseReponseCourante();
  }

  const lisIdQuestionCourante = (q: number) => etapesTestMaturite[q].id;

  const idQuestionCourante = $derived(lisIdQuestionCourante($questionnaireStore.questionCourante));

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

  const montreProposition = $derived.by(() => {
    const avecPropositions = etapesTestMaturite.filter((q) => q.propositions.length > 0);
    return $questionnaireStore.questionCourante < avecPropositions.length;
  });

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

  const enSessionGroupe = $derived(!!codeSessionGroupe);
  const organisateurSessionGroupe = $derived(enSessionGroupe && organisateurSession);
  const moyenne = $derived(
    $questionnaireStore.toutesLesReponses.reduce((accumulateur, réponse) => accumulateur + réponse, 0) /
      $questionnaireStore.toutesLesReponses.length
  );
  const idNiveau = $derived(calculeIdNiveau(moyenne));
</script>

{#if afficheResultats}
  <ResultatsTestMaturite {idNiveau} />
{:else if introFaite}
  <dsfr-container class="test-maturite">
    <div class="lien-retour">
      <Lien href="/" libelle="Retour à l'accueil" icone="arrow-go-back-line"></Lien>
    </div>
    {#if organisateurSessionGroupe}
      <dsfr-alert
        type="info"
        has-description
        text="En tant qu’organisateur, vos réponses ne seront pas enregistrées ni prises en compte dans les résultats du groupe."
      ></dsfr-alert>
    {/if}
    <div class="contenu-test" bind:this={contenuTest}>
      <div class="formulaire">
        <Etapier
          etapeCourante={$questionnaireStore.questionCourante + 1}
          nombreEtapes={7}
          titreEtapeCourante={etapesTestMaturite[$questionnaireStore.questionCourante].titre}
          titreEtapeSuivante={etapesTestMaturite[$questionnaireStore.questionCourante + 1]?.titre}
        />
        <hr />
        <h2>
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html aseptiseHtml(etapesTestMaturite[$questionnaireStore.questionCourante].question)}
        </h2>

        {#if montreProposition}
          <div class="propositions">
            <dsfr-radios-group
              value={reponseCourante}
              radios={etapesTestMaturite[$questionnaireStore.questionCourante].propositions.map(
                (proposition, index) => ({
                  label: `${index + 1}. ${proposition}`,
                  id: `radio-${index}`,
                  value: index,
                })
              )}
              onvaluechanged={(e: CustomEvent<number>) => {
                reponseCourante = e.detail;
              }}
            ></dsfr-radios-group>
          </div>

          <div class="commandes">
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
            <SelectSecteurActivite libelle="Quel est le secteur d’activité de votre organisation&nbsp;?" bind:secteur />
            <SelectRegion libelle="Dans quelle région / territoire se trouve votre organisation ?" bind:region />
            <SelectTailleOrganisation libelle="Quelle est la taille de votre organisation ?" bind:tailleOrganisation />

            <div class="commandes">
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
        <img src="/assets/images/test-maturite/illustration-{idQuestionCourante}.svg" width="432" height="324" alt="" />
      </div>
    </div>
  </dsfr-container>
{:else}
  <IntroductionTestMaturite bind:introFaite />
{/if}

<style lang="scss">
  .informations-complementaires {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .lien-retour {
    margin-bottom: 48px;
  }

  dsfr-alert {
    margin-bottom: 2rem;
  }

  hr {
    margin-block: 2rem;
    height: 1px;
    border: 0;
    background-color: var(--border-default-grey);
  }
</style>
