<script lang="ts">
  import {
    type NiveauMaturite,
    niveauxMaturite,
  } from "./NiveauxMaturite.donnees";
  import SelectNiveauMaturite from "./SelectNiveauMaturite.svelte";
  import IllustrationNiveauMaturite from "./IllustrationNiveauMaturite.svelte";

  const COLONNES = 2;

  let niveauxSelectionnes: NiveauMaturite[] = [];
  for (let i = 0; i < COLONNES; i++) {
    niveauxSelectionnes.push(niveauxMaturite[i]);
  }
</script>

<section class="niveaux">
  <div class="contenu-section">
    <div class="grille-haute">
      {#each { length: COLONNES } as _, i}
        <SelectNiveauMaturite bind:niveauSelectionne={niveauxSelectionnes[i]} />
      {/each}

      {#each { length: COLONNES } as _, i}
        <IllustrationNiveauMaturite
          niveauSelectionne={niveauxSelectionnes[i]}
        />
      {/each}

      {#each { length: COLONNES } as _, i}
        <p class="description">{niveauxSelectionnes[i].description}</p>
      {/each}
    </div>

    <h2>Les 6 critères pour évaluer votre niveau de maturité cyber</h2>

    <div class="details">
      <div class="detail">
        <h3>Prise en compte du risque</h3>
        {#each { length: COLONNES } as _, i}
          <p>{niveauxSelectionnes[i].priseEnCompteRisque}</p>
        {/each}
      </div>

      <div class="detail">
        <h3>Posture à l'égard de la cyber</h3>
        {#each { length: COLONNES } as _, i}
          <p>{niveauxSelectionnes[i].posture}</p>
        {/each}
      </div>

      <div class="detail">
        <h3>Pilotage de la sécurité</h3>
        {#each { length: COLONNES } as _, i}
          <p>{niveauxSelectionnes[i].pilotage}</p>
        {/each}
      </div>

      <div class="detail">
        <h3>Resources humaines</h3>
        {#each { length: COLONNES } as _, i}
          <p>{niveauxSelectionnes[i].ressourcesHumaines}</p>
        {/each}
      </div>

      <div class="detail">
        <h3>Budget</h3>
        {#each { length: COLONNES } as _, i}
          <p>{niveauxSelectionnes[i].budget}</p>
        {/each}
      </div>

      <div class="detail">
        <h3>Adoption des solutions cyber</h3>
        {#each { length: COLONNES } as _, i}
          <p>{niveauxSelectionnes[i].adoptionSolutions}</p>
        {/each}
      </div>

      <div class="detail">
        <h3>Niveau de sécurité</h3>
        {#each { length: COLONNES } as _, i}
          <p>{niveauxSelectionnes[i].niveauSecurite}</p>
        {/each}
      </div>

      <div class="detail">
        <h3>La priorité</h3>
        {#each { length: COLONNES } as _, i}
          <p>{niveauxSelectionnes[i].priorite}</p>
        {/each}
      </div>
    </div>
  </div>
</section>
