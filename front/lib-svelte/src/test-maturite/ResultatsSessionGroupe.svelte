<script>
  import GraphiqueAnneau from './GraphiqueAnneau.svelte';
  import TuilesMaturiteSessionGroupe from './TuilesMaturiteSessionGroupe.svelte';
  import { pourcentagesSerie } from './Serie';
  const serie = [
    { libelle: 'Insuffisant', valeur: 16 },
    { libelle: 'Émergent', valeur: 11 },
    { libelle: 'Intermédiaire', valeur: 16 },
    { libelle: 'Confirmé', valeur: 8 },
    { libelle: 'Optimal', valeur: 3 },
  ];
</script>

<section>
  <div class="contenu-section">
    <h2>Les 5 niveaux de maturité cyber</h2>
    <TuilesMaturiteSessionGroupe />
    <a href="/niveaux-maturite" class="lien" target="_blank">
      Les niveaux de maturité cyber
    </a>
  </div>
</section>

<section>
  <div class="contenu-section">
    <h2>Répartition des niveaux de maturité cyber de cette session</h2>
    <div class="repartition-niveaux-maturite">
      <GraphiqueAnneau {serie} />
      <div class="legende">
        {#each pourcentagesSerie(serie) as pourcentage, index (index)}
          {@const element = serie[index]}
          <div class="ligne-legende ligne-legende-{index}">
            <span class="libelle">{element.libelle}</span>
            <div>
              <span class="total">{element.valeur}</span>
              <span class="pourcentage">({Math.round(pourcentage)}%)</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<section>
  <div class="contenu-section">
    <h2>Répartition des réponses</h2>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  section {
    padding: 48px var(--gouttiere) 0;

    .contenu-section {
      display: flex;
      flex-direction: column;
      gap: 32px;
      padding-bottom: 48px;
      border-bottom: 1px solid var(--gris-clair);
    }
  }

  h2 {
    margin: 0;
    font-size: 2rem;
    line-height: 2.5rem;
  }

  .repartition-niveaux-maturite {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 48px;
  }

  .legende {
    width: 242px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ligne-legende {
    display: grid;
    gap: 10px;
    grid-template-columns: 24px 2fr 1fr;
    align-items: center;

    div {
      text-wrap: nowrap;
    }

    .total {
      font-weight: bold;
    }
  }

  .ligne-legende:before {
    width: 14px;
    height: 14px;
    border-radius: 7px;
    content: '';
    background-color: var(--couleur-puce);
  }

  .ligne-legende-0 {
    --couleur-puce: #6369f1;
  }

  .ligne-legende-1 {
    --couleur-puce: #fec54b;
  }

  .ligne-legende-2 {
    --couleur-puce: #8248a1;
  }

  .ligne-legende-3 {
    --couleur-puce: #f26c85;
  }

  .ligne-legende-4 {
    --couleur-puce: #8ed4a3;
  }
</style>
