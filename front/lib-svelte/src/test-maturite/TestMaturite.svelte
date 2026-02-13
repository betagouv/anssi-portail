<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { profilStore } from '../stores/profil.store';
  import Etapier from '../ui/Etapier.svelte';
  import Hero from '../ui/Hero.svelte';
  import ComparaisonTest from './ComparaisonTest.svelte';
  import IntroductionTestMaturite from './IntroductionTestMaturite.svelte';
  import PartageTest from './PartageTest.svelte';
  import ResultatsTestMaturite from './ResultatsTestMaturite.svelte';
  import { enregistreIdResultatTestPourRevendication } from './resultatTest';
  import SelectRegion from './SelectRegion.svelte';
  import SelectSecteurActivite from './SelectSecteurActivite.svelte';
  import SelectTailleOrganisation from './SelectTailleOrganisation.svelte';
  import {
    questionnaireStore,
    resultatsQuestionnaire,
  } from './stores/questionnaire.store';
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
    reponseCourante =
      $questionnaireStore.toutesLesReponses[
        $questionnaireStore.questionCourante
      ];
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

  $: idQuestionCourante = lisIdQuestionCourante(
    $questionnaireStore.questionCourante
  );

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
    const avecPropositions = etapesTestMaturite.filter(
      (q) => q.propositions.length > 0
    );
    montreProposition =
      $questionnaireStore.questionCourante < avecPropositions.length;
  }

  let ongletActif: 'votre-organisation' | 'comparaison' = 'votre-organisation';

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
    arianeBranche={enSessionGroupe
      ? { nom: 'Test de maturité cyber', lien: '/test-maturite' }
      : undefined}
    arianeBrancheConnectee={enSessionGroupe
      ? { nom: 'Maturité cyber', lien: '/ma-maturite' }
      : undefined}
  />

  {#if ongletActif === 'votre-organisation'}
    <section class="test-maturite">
      <div class="contenu-section">
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
              <Etapier
                etapeCourante={$questionnaireStore.questionCourante}
                nombreEtapes={7}
              />
              <h2>
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html etapesTestMaturite[$questionnaireStore.questionCourante]
                  .question}
              </h2>

              {#if montreProposition}
                <div class="propositions">
                  {#each etapesTestMaturite[$questionnaireStore.questionCourante].propositions as proposition, index (proposition)}
                    <label>
                      <input
                        type="radio"
                        bind:group={reponseCourante}
                        value={index}
                      />
                      <span>{index + 1}.&nbsp;{proposition}</span>
                    </label>
                  {/each}
                </div>

                <div class="commandes">
                  <a href="/" class="lien">Retour à l'accueil</a>
                  <input
                    type="button"
                    class="bouton secondaire taille-moyenne"
                    value="Précédent"
                    disabled={$questionnaireStore.questionCourante === 0}
                    on:click={reviensEnArriere}
                  />
                  <input
                    type="button"
                    class="bouton primaire taille-moyenne"
                    value="Question suivante"
                    disabled={reponseCourante === null}
                    on:click={valideReponse}
                  />
                </div>
              {:else}
                <div class="informations-complementaires">
                  <label>
                    Quel est le secteur d’activité de votre organisation&nbsp;?
                    <SelectSecteurActivite bind:secteur />
                  </label>

                  <label>
                    Dans quelle région / territoire se trouve votre
                    organisation&nbsp;?
                    <SelectRegion bind:region />
                  </label>

                  <label>
                    Quelle est la taille de votre organisation&nbsp;?
                    <SelectTailleOrganisation bind:tailleOrganisation />
                  </label>

                  <div class="commandes">
                    <a href="/" class="lien">Retour à l'accueil</a>
                    <input
                      type="button"
                      class="bouton secondaire taille-moyenne"
                      value="Précédent"
                      on:click={questionnaireStore.reviensEnArriere}
                    />
                    {#if organisateurSession}
                      <input
                        type="button"
                        class="bouton primaire taille-moyenne"
                        value="Afficher les résultats"
                        on:click={afficheResultatSessionGroupe}
                      />
                    {:else}
                      <input
                        type="button"
                        class="bouton primaire taille-moyenne"
                        value="Obtenir mon résultat"
                        on:click={obtiensResultat}
                      />
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
            <div class="illustration">
              <img
                src="/assets/images/test-maturite/illustration-{idQuestionCourante}.svg"
                alt=""
              />
            </div>
          </div>
        {:else}
          <IntroductionTestMaturite bind:introFaite />
        {/if}
      </div>
    </section>

    {#if !introFaite}
      <PartageTest />
    {/if}
  {:else}
    <ComparaisonTest testRealise={false} />
    <PartageTest couleurFond="clair" />
  {/if}
{/if}

