<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import {
    couleursDeNiveau,
    niveauxMaturite,
  } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import type { IdNiveau } from '../niveaux-maturite/NiveauxMaturite.type';
  import GraphiqueAnneau from './GraphiqueAnneau.svelte';
  import LegendeAnneau from './LegendeAnneau.svelte';
  import PartageTest from './PartageTest.svelte';
  import RadarSessionGroupe from './RadarSessionGroupe.svelte';
  import type { DernierResultatTest } from './ResultatsTest.type';
  import ResumeRadarComparaison from './ResumeRadarComparaison.svelte';
  import type { Serie, SerieRadar } from './Serie';
  import type { IdRubrique } from './TestMaturite.type';

  export let testRealise = false;

  type RepartitionResultatsTestPourUnNiveau = {
    id: IdNiveau;
    valeurs: Record<IdRubrique, number>;
    totalNombreTests: number;
  };

  const libelleDeNiveau = (idNiveau: IdNiveau) => {
    return niveauxMaturite.find((niveau) => niveau.id === idNiveau)!.label;
  };

  let niveauCourant: IdNiveau | undefined;
  let libelleNiveauCourant: string | undefined;
  let serie: Serie = [];
  let seriesRadar: SerieRadar[] = [];

  async function chargeNiveauCourant() {
    const reponse = await axios.get<DernierResultatTest>(
      '/api/resultats-test/dernier'
    );
    niveauCourant = reponse.data.idNiveau;
    libelleNiveauCourant = libelleDeNiveau(niveauCourant);
  }

  async function chargeRepartitionsDesResultats() {
    const reponse = await axios.get<RepartitionResultatsTestPourUnNiveau[]>(
      '/api/repartition-resultats-test'
    );
    serie = reponse.data.map((repartionPourUnNiveau) => ({
      libelle: libelleDeNiveau(repartionPourUnNiveau.id),
      valeur: repartionPourUnNiveau.totalNombreTests,
    }));

    seriesRadar = reponse.data.map((repartionPourUnNiveau) => ({
      id: repartionPourUnNiveau.id,
      couleur: couleursDeNiveau[repartionPourUnNiveau.id],
      valeurs: repartionPourUnNiveau.valeurs,
    }));
  }
  onMount(async () => {
    await chargeNiveauCourant();
    await chargeRepartitionsDesResultats();
  });
</script>

{#if testRealise}
  <section class="repartion-organisations">
    <div class="contenu-section">
      <h2>Répartition des organisations</h2>
      <div class="repartition-niveaux-maturite">
        <GraphiqueAnneau {serie} nomDeLaDonnee="organisations" />
        <LegendeAnneau {serie} actif={libelleNiveauCourant} />
      </div>
    </div>
  </section>

  <section class="repartition-reponses">
    <div class="contenu-section">
      <h2>Répartition des réponses</h2>
      <RadarSessionGroupe series={seriesRadar} affichageReduit />
      <ResumeRadarComparaison series={seriesRadar} actif={niveauCourant} />
      <div class="message-information">
        Le résultat obtenu est une évaluation indicative basée sur un modèle
        élaboré par l’ANSSI. La maturité cyber n’est pas une évaluation du
        niveau de sécurité des systèmes d’information d’une organisation mais de
        sa posture à l’égard des enjeux cyber.
      </div>
    </div>
  </section>
{:else}
  <section class="pas-de-test">
    <div class="contenu-section">
      <img
        src="/assets/images/illustration-dragon-aucun-resultat.svg"
        alt="Bientôt disponible"
      />
      <h4>Vous souhaitez comparer la maturité cyber de votre organisation ?</h4>
      <p>Pour cela vous devez d’abord réaliser le test de maturité cyber.</p>
      <a href="/test-maturite" class="bouton primaire"> Débuter le test </a>
    </div>
  </section>
{/if}
<PartageTest />

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .repartion-organisations {
    padding: 32px var(--gouttiere) 48px;

    .contenu-section {
      display: flex;
      flex-direction: column;
      gap: 48px;

      .repartition-niveaux-maturite {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        gap: 56px;
        @include a-partir-de(md) {
          flex-direction: row;
        }
      }
    }
  }

  .repartition-reponses {
    padding: 48px var(--gouttiere);

    .contenu-section {
      display: flex;
      flex-direction: column;
      gap: 32px;

      @include a-partir-de(md) {
        gap: 48px;
      }

      h2 {
        margin-bottom: 32px;
        @include a-partir-de(md) {
          margin: 0;
        }
      }

      .message-information {
        margin-top: 16px;
        font-size: 0.75rem;
        line-height: 1.5rem;
        padding: 24px 0;
        color: #666666;
      }
    }
  }

  .pas-de-test {
    .contenu-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      text-align: center;
    }

    img {
      max-width: 282px;
    }

    h4 {
      font-size: 1.5rem;
      line-height: 1.75rem;
      max-width: 588px;
    }

    p {
      font-size: 1.125rem;
      line-height: 1.75rem;
      max-width: 588px;
    }
  }
</style>
