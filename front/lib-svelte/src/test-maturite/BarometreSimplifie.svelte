<script lang="ts">
  import { onMount } from 'svelte';
  import { niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import GraphiqueAnneau from './GraphiqueAnneau.svelte';
  import LegendeLigne from './LegendeLigne.svelte';
  import { pourcentagesSerie, type Serie } from './Serie';
  import { récupèreStatistiquesMSC, type Statistiques } from '../passerelles/statistiquesMSC';

  let serie: Serie = [];

  onMount(async () => {
    const reponse: Statistiques = await récupèreStatistiquesMSC();
    const testParNiveau = reponse.testsMaturite.parNiveau;
    const serieConstruite: Serie = [];
    for (const [idNiveau, valeur] of Object.entries(testParNiveau)) {
      const libelle = niveauxMaturite.find((niveau) => niveau.id === idNiveau)!.label;
      serieConstruite.push({ libelle, valeur });
    }
    serie = serieConstruite;
  });
  let pourcentages: number[] = [];
  $: {
    pourcentages = pourcentagesSerie(serie);
  }
</script>

<div class="barometre-simplifie">
  <GraphiqueAnneau {serie} nomDeLaDonnee="tests réalisés" />
  <div class="legende">
    {#each serie as element, index (index)}
      <LegendeLigne
        actif={false}
        {index}
        libelle={element.libelle}
        valeur={undefined}
        pourcentage={pourcentages[index]}
        affichePourcentages={false}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  .barometre-simplifie {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    .legende {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
    }
  }
</style>
