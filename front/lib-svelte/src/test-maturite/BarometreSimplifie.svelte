<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import type { Statistiques } from '../statistiques/statistiques.type';
  import GraphiqueAnneau from './GraphiqueAnneau.svelte';
  import LegendeLigne from './LegendeLigne.svelte';
  import type { Serie } from './Serie';

  let serie: Serie = [];

  onMount(async () => {
    const reponse = await axios.get<Statistiques>('/api/statistiques');
    const testParNiveau = reponse.data.testsMaturite.parNiveau;
    const serieConstruite: Serie = [];
    for (const [idNiveau, valeur] of Object.entries(testParNiveau)) {
      const libelle = niveauxMaturite.find(
        (niveau) => niveau.id === idNiveau
      )!.label;
      serieConstruite.push({ libelle, valeur });
    }
    serie = serieConstruite;
  });
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
        pourcentage={undefined}
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
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
  }
</style>
