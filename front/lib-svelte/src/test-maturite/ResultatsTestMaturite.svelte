<script lang="ts">
  import TuilesMaturite from './TuilesMaturite.svelte';
  import { type IdNiveau, niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import { questionnaireStore, resultatsQuestionnaire } from './stores/questionnaire.store';
  import PubliciteMesServicesCyber from './PubliciteMesServicesCyber.svelte';
  import RadarMaturite from './RadarMaturite.svelte';
  import PartageTest from './PartageTest.svelte';
  import { questions } from './TestMaturite.donnees';
  import Hero from '../ui/Hero.svelte';
  import ComparaisonTest from './ComparaisonTest.svelte';
  import OngletsTest from './OngletsTest.svelte';
  import { profilStore } from '../stores/profil.store';
  import EncartDeRecommandationSelonMaturite from './EncartDeRecommandationSelonMaturite.svelte';

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


{#if $profilStore}
  <section class="refaire-test">
    <div class="contenu-section">
      <p>
        Mesurez l’évolution de votre maturité cyber pour savoir où vous en êtes et quelles actions renforcer.
        <lab-anssi-lien
          href="/test-maturite" apparence="lien-texte" titre="Débuter le test"></lab-anssi-lien>
      </p>
    </div>
  </section>
{/if}

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

  <EncartDeRecommandationSelonMaturite {niveau} />

  <PartageTest couleurFond="fonce" />
{:else}
  <ComparaisonTest testRealise={true} />
{/if}

<style lang="scss">
  .refaire-test {
    padding: 48px var(--gouttiere) 0;
  }
</style>