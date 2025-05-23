<script lang="ts">
  import { etapesTestMaturite } from './TestMaturite.donnees';
  import {
    questionnaireStore,
    resultatsQuestionnaire,
  } from './stores/questionnaire.store';
  import Etapier from '../ui/Etapier.svelte';
  import ResultatsTestMaturite from './ResultatsTestMaturite.svelte';
  import SelectSecteurActivite from './SelectSecteurActivite.svelte';
  import SelectRegion from './SelectRegion.svelte';
  import SelectTailleOrganisation from './SelectTailleOrganisation.svelte';
  import axios from 'axios';
  import { enregistreIdResultatTestPourRevendication } from './resultatTest';
  import { profilStore } from '../stores/profil.store';
  import Hero from '../ui/Hero.svelte';
  import PartageTest from './PartageTest.svelte';
  import OngletsTest from './OngletsTest.svelte';
  import ComparaisonTest from './ComparaisonTest.svelte';
  import { onMount } from 'svelte';

  let afficheResultats = false;
  let introFaite = false;

  let secteur: string | null;
  let region: string | null;
  let tailleOrganisation: string | null;

  questionnaireStore.initialise();

  let reponseCourante: number;
  let codeSessionGroupe: string | undefined;
  let organisateurSession = false;

  actualiseReponseCourante();

  function actualiseReponseCourante() {
    reponseCourante =
      $questionnaireStore.toutesLesReponses[
        $questionnaireStore.questionCourante
      ];
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

  const utilisateurEstConnecte = async () =>
    profilStore.utilisateurEstConnecte();

  async function obtiensResultat() {
    const reponse = await axios.post<CreationTest>('/api/resultats-test', {
      reponses: $resultatsQuestionnaire,
      secteur,
      region,
      tailleOrganisation,
      codeSessionGroupe,
    });
    const { id } = reponse.data;
    const estConnecte = await utilisateurEstConnecte();
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

  function debuteTeste() {
    introFaite = true;
  }

  function doitMontrerPropositions() {
    const avecPropositions = etapesTestMaturite.filter(
      (q) => q.propositions.length > 0
    );
    return $questionnaireStore.questionCourante < avecPropositions.length;
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
        alert("Code de session inconnu, vous allez être redirigé");
        window.location.href = "/session-groupe";
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
    ariane={enSessionGroupe
      ? 'Session de groupe'
      : 'Tester votre maturité cyber'}
    arianeBranche={enSessionGroupe
      ? { nom: 'Tester votre maturité cyber', lien: '/test-maturite' }
      : undefined}
    arianeBrancheConnectee={enSessionGroupe
      ? { nom: 'Maturité cyber', lien: '/ma-maturite' }
      : undefined}
  />

  <OngletsTest bind:ongletActif />

  {#if ongletActif === 'votre-organisation'}
    <section class="test-maturite">
      <div class="contenu-section">
        {#if introFaite}
          {#if organisateurSessionGroupe}
            <lab-anssi-alerte
              description="En tant qu’organisateur, vos réponses ne seront pas enregistrées ni prises en compte dans les résultats du groupe."
            ></lab-anssi-alerte>
          {/if}
          <div class="contenu-test">
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

              {#if doitMontrerPropositions()}
                <div class="propositions">
                  {#each etapesTestMaturite[$questionnaireStore.questionCourante].propositions as proposition, index (proposition)}
                    <label>
                      <input
                        type="radio"
                        bind:group={reponseCourante}
                        value={index}
                      />
                      <span>{proposition}</span>
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
                    Dans quelle région se trouve votre organisation&nbsp;?
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
          <div class="introduction">
            <h2>Quelle est la maturité cyber de votre organisation ?</h2>
            <p>
              La maturité cyber <b>reflète</b> le niveau global de prise en
              compte des enjeux de cybersécurité par une organisation. Répondez
              à
              <b>6 questions</b>
              pour obtenir votre évaluation <b>indicative</b>.
            </p>
            <input
              type="button"
              class="bouton primaire taille-moyenne"
              value="Débuter le test"
              on:click={debuteTeste}
            />
            <div class="note">
              Le résultat obtenu est une évaluation indicative basée sur un
              modèle élaboré par l’ANSSI. La maturité cyber n’est pas une
              évaluation du niveau de sécurité des systèmes d’information d’une
              organisation mais de sa posture à l’égard des enjeux cyber.
            </div>
          </div>
          <div class="illustration">
            <img
              src="/assets/images/test-maturite/illustration-prise-en-compte-risque.svg"
              alt=""
            />
          </div>
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
