<script lang="ts">
  import {
    type NiveauMaturite,
    niveauxMaturite,
  } from "./NiveauxMaturite.donnees";

  let niveauSelectionne: NiveauMaturite = niveauxMaturite[0];
</script>

<section class="niveaux">
  <div class="contenu-section">
    <select bind:value={niveauSelectionne}>
      {#each niveauxMaturite as niveau}
        <option value={niveau}>{niveau.label}</option>
      {/each}
    </select>

    <div class="illustration">
      <img
        src="/assets/images/test-maturite/niveaux/{niveauSelectionne.id}.svg"
        alt={`Illustration niveau ${niveauSelectionne.label}`}
      />
    </div>

    <p class="description">{niveauSelectionne.description}</p>

    <h2>Les 6 critères pour évaluer votre niveau de maturité cyber</h2>

    <div class="details">
      <h3>Prise en compte du risque</h3>
      <p>{niveauSelectionne.priseEnCompteRisque}</p>

      <h3>Posture à l'égard de la cyber</h3>
      <p>{niveauSelectionne.posture}</p>

      <h3>Pilotage de la sécurité</h3>
      <p>{niveauSelectionne.pilotage}</p>

      <h3>Resources humaines</h3>
      <p>{niveauSelectionne.ressourcesHumaines}</p>

      <h3>Budget</h3>
      <p>{niveauSelectionne.budget}</p>

      <h3>Adoption des solutions cyber</h3>
      <p>{niveauSelectionne.adoptionSolutions}</p>

      <h3>Niveau de sécurité</h3>
      <p>{niveauSelectionne.niveauSecurite}</p>

      <h3>La priorité</h3>
      <p>{niveauSelectionne.priorite}</p>
    </div>
  </div>
</section>
