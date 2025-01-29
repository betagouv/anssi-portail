<script lang="ts">
  import {
    type NiveauMaturite,
    niveauxMaturite,
  } from "./NiveauxMaturite.donnees";

  let niveauSelectionne: NiveauMaturite = niveauxMaturite[0];
  let niveauSelectionne2: NiveauMaturite = niveauxMaturite[1];
</script>

<section class="niveaux">
  <div class="contenu-section">
    <div class="grille-haute">
      <select bind:value={niveauSelectionne}>
        {#each niveauxMaturite as niveau}
          <option value={niveau}>{niveau.label}</option>
        {/each}
      </select>
      <select bind:value={niveauSelectionne2}>
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
      <div class="illustration">
        <img
          src="/assets/images/test-maturite/niveaux/{niveauSelectionne2.id}.svg"
          alt={`Illustration niveau ${niveauSelectionne.label}`}
        />
      </div>

      <p class="description">{niveauSelectionne.description}</p>
      <p class="description">{niveauSelectionne2.description}</p>
    </div>

    <h2>Les 6 critères pour évaluer votre niveau de maturité cyber</h2>

    <div class="details">
      <div class="detail">
        <h3>Prise en compte du risque</h3>
        <p>{niveauSelectionne.priseEnCompteRisque}</p>
      </div>

      <div class="detail">
        <h3>Posture à l'égard de la cyber</h3>
        <p>{niveauSelectionne.posture}</p>
      </div>

      <div class="detail">
        <h3>Pilotage de la sécurité</h3>
        <p>{niveauSelectionne.pilotage}</p>
      </div>

      <div class="detail">
        <h3>Resources humaines</h3>
        <p>{niveauSelectionne.ressourcesHumaines}</p>
      </div>

      <div class="detail">
        <h3>Budget</h3>
        <p>{niveauSelectionne.budget}</p>
      </div>

      <div class="detail">
        <h3>Adoption des solutions cyber</h3>
        <p>{niveauSelectionne.adoptionSolutions}</p>
      </div>

      <div class="detail">
        <h3>Niveau de sécurité</h3>
        <p>{niveauSelectionne.niveauSecurite}</p>
      </div>

      <div class="detail">
        <h3>La priorité</h3>
        <p>{niveauSelectionne.priorite}</p>
      </div>
    </div>
  </div>
</section>
