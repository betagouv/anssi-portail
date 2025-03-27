<script lang="ts">
  import TuilesMaturite from './TuilesMaturite.svelte';
  import { type IdNiveau, niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import { questionnaireStore, resultatsQuestionnaire } from './stores/questionnaire.store';
  import PubliciteMesServicesCyber from './PubliciteMesServicesCyber.svelte';
  import RadarMaturite from './RadarMaturite.svelte';
  import TuileVersParcours from './TuileVersParcours.svelte';
  import PartageTest from './PartageTest.svelte';
  import { questions } from './TestMaturite.donnees';
  import Onglet from '../ui/Onglet.svelte';
  import ConteneurOnglets from '../ui/ConteneurOnglets.svelte';
  import Hero from '../ui/Hero.svelte';

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

  $: niveau =
    niveauxMaturite.find((niveau) => niveau.id === idNiveau) ||
    niveauxMaturite[0];

  let ongletActif: 'votre-organisation' | 'comparaison' = 'votre-organisation';
</script>

<Hero
  titre="Résultat de maturité cyber"
  description="Ce résultat nous permet de vous guider et de vous fournir les informations et les outils essentiels pour agir sur votre maturité cyber."
  ariane="Tester votre maturité cyber"
/>
<section class="section-onglets">
  <div class="contenu-section">
    <ConteneurOnglets>
      <Onglet
        bind:ongletActif
        cetOnglet="votre-organisation"
        labelOnglet="Maturité cyber de votre organisation"
      ></Onglet>
      <Onglet
        bind:ongletActif
        cetOnglet="comparaison"
        labelOnglet="Comparaison avec d’autres entités"
      ></Onglet>
    </ConteneurOnglets>
  </div>
</section>

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
          {#each questions as question}
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
{:else}
  <section class="comparaison">
    <div class="contenu-section">
      <img
        src="/assets/images/illustration-dragon-aucun-resultat.svg"
        alt="Aucun favori sauvegardé"
      />
      <h4>Bientôt disponible pour votre organisation.</h4>
      <p>Contribuez à enrichir l’expérience pour vous et les autres organisations en evaluant votre maturité cyber.</p>
      <a href="/test-maturite" class="bouton primaire">Tester votre maturité cyber</a>
    </div>
  </section>
{/if}

<section class="partage-test">
  <div class="contenu-section">
    <PartageTest />
  </div>
</section>
