<script lang="ts">
  import TuilesMaturite from './TuilesMaturite.svelte';
  import { type IdNiveau, niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import { questionnaireStore, resultatsQuestionnaire } from './stores/questionnaire.store';
  import PubliciteMesServicesCyber from './PubliciteMesServicesCyber.svelte';
  import RadarMaturite from './RadarMaturite.svelte';
  import TuileVersParcours from './TuileVersParcours.svelte';
  import PartageTest from './PartageTest.svelte';
  import { questions } from './TestMaturite.donnees';
  import Hero from '../ui/Hero.svelte';
  import ComparaisonTest from './ComparaisonTest.svelte';
  import OngletsTest from './OngletsTest.svelte';
  import { profilStore } from '../stores/profil.store';

  export let affichePubMsc = true;
  export let afficheRappelReponses = false;
  export let animeTuiles = true;

  const calculeIdNiveau = (moyenne: number): IdNiveau => {
    if (moyenne < 1) return 'insuffisant';
    if (moyenne < 2) return 'emergent';
    if (moyenne < 3) return 'intermediaire';
    if (moyenne < 4) return 'confirme';
    return 'optimal';
  };

  $: moyenne =
    $questionnaireStore.toutesLesReponses.reduce(
      (acc, valeur) => acc + valeur,
      0,
    ) / $questionnaireStore.toutesLesReponses.length;

  $: idNiveau = calculeIdNiveau(moyenne);

  const trouveNiveauMaturiteParId = (id: string) =>
    niveauxMaturite.find((niveau) => niveau.id === id) || niveauxMaturite[0];

  $: niveau = trouveNiveauMaturiteParId(idNiveau);

  let ongletActif: 'votre-organisation' | 'comparaison' = 'votre-organisation';
</script>

<Hero
  titre="Résultat de maturité cyber"
  description="Ce résultat nous permet de vous guider et de vous fournir les informations et les outils essentiels pour agir sur votre maturité cyber."
  ariane={$profilStore ? 'Maturité cyber' : 'Tester votre maturité cyber'}
/>

<OngletsTest bind:ongletActif />

{#if ongletActif === 'votre-organisation'}
  <section class="resultats-test">
    <div class="contenu-section">
      <h2>Niveau de maturité le plus proche : {niveau.label}</h2>
      <TuilesMaturite niveauCourant={niveau} {animeTuiles} />
      <div class="description-niveau">
        <h5>{niveau.label}</h5>
        <p>{niveau.description}</p>
      </div>

      <a href="/niveaux-maturite" class="lien" target="_blank"
      >Les niveaux de maturité cyber</a
      >
    </div>
  </section>

  {#if affichePubMsc}
    <section class="pour-aller-plus-loin">
      <div class="contenu-section">
        <PubliciteMesServicesCyber />
      </div>
    </section>
  {/if}

  <section class="repartition">
    <div class="contenu-section">
      <h2>Répartition de votre maturité cyber</h2>
      <RadarMaturite resultats={$resultatsQuestionnaire} />
      <div class="note">
        Ce résultat est une évaluation indicative basé sur un modèle élaboré par
        l’ANSSI. La maturité cyber n’est pas une évaluation du niveau de
        sécurité des systèmes d’information d’une organisation.
      </div>
    </div>
  </section>

  {#if afficheRappelReponses}
    <section class="rappel-reponses">
      <div class="contenu-section">
        <h2>Rappel de vos réponses</h2>
        <div class="reponses">
          {#each questions as question (question.id)}
            <div class="reponse">
              <h3>{question.titre}</h3>
              <p>
                {question.propositions[
                ($resultatsQuestionnaire[question.id] || 1) - 1
                  ]}
              </p>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  {#if niveau.id === 'insuffisant' }
    <section class="encart fond-clair">
      <div class="contenu-section">
        <div class="carte parcours cyber-depart">
          <img
            src="/assets/images/dragon-kart.svg"
            alt="Illustration diagnostic cyber"
            class="illustration"
          />
          <h2>Bénéficiez d’un diagnostic cyber gratuit</h2>
          <p>
            Vous souhaitez <b>protéger votre organisation contre les cyberattaques</b> mais ne savez pas par quoi
            commencer
            ?
            <b>Prenez votre cyberdépart</b> avec un <b>premier diagnostic gratuit</b> et anonyme d'une heure dans vos
            locaux
            <b>accompagné
              par un Aidant de la communauté MonAideCyber</b>.
          </p>
          <a href="/cyberdepart" class="bouton primaire">
            Demander mon diagnostic cyber
          </a>
        </div>
      </div>
    </section>
  {:else }
    <section class="votre-parcours">
      <div class="contenu-section">
        {#if niveau.id === 'intermediaire'}
          <TuileVersParcours parcours="approfondir" />
        {:else if niveau.id === 'optimal' || niveau.id === 'confirme'}
          <div class="tuile">
            <img src="/assets/images/debuter-cyber.png" alt="" />
            <h3>Les services et ressources cyber</h3>
            <p>
              Trouvez les services et les ressources adaptés à vos besoins et
              votre maturité cyber.
            </p>
            <a href="/catalogue" class="bouton primaire">Découvrir</a>
          </div>
        {:else}
          <TuileVersParcours parcours="debuter" />
        {/if}
      </div>
    </section>
  {/if}

  <PartageTest couleurFond="fonce" />
{:else}
  <ComparaisonTest testRealise={true} />
{/if}
