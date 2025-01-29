<script lang="ts">
  import {
    type NiveauMaturite,
    niveauxMaturite,
  } from "./NiveauxMaturite.donnees";

  let niveauxSelectionnes: NiveauMaturite[] = [];
  for (let i = 0; i < 2; i++) {
    niveauxSelectionnes.push(niveauxMaturite[i]);
  }
</script>

<section class="niveaux">
  <div class="contenu-section">
    <div class="grille-haute">
      {#each { length: 2 } as _, i}
        <select bind:value={niveauxSelectionnes[i]}>
          {#each niveauxMaturite as niveau}
            <option value={niveau}>{niveau.label}</option>
          {/each}
        </select>
      {/each}

      {#each { length: 2 } as _, i}
        <div class="illustration">
          <img
            src="/assets/images/test-maturite/niveaux/{niveauxSelectionnes[i]
              .id}.svg"
            alt={`Illustration niveau ${niveauxSelectionnes[i].label}`}
          />
        </div>
      {/each}

      {#each { length: 2 } as _, i}
        <p class="description">{niveauxSelectionnes[i].description}</p>
      {/each}
    </div>

    <h2>Les 6 critères pour évaluer votre niveau de maturité cyber</h2>

    <div class="details">
      <div class="detail">
        <h3>Prise en compte du risque</h3>
        <p>{niveauxSelectionnes[0].priseEnCompteRisque}</p>
      </div>

      <div class="detail">
        <h3>Posture à l'égard de la cyber</h3>
        <p>{niveauxSelectionnes[0].posture}</p>
      </div>

      <div class="detail">
        <h3>Pilotage de la sécurité</h3>
        <p>{niveauxSelectionnes[0].pilotage}</p>
      </div>

      <div class="detail">
        <h3>Resources humaines</h3>
        <p>{niveauxSelectionnes[0].ressourcesHumaines}</p>
      </div>

      <div class="detail">
        <h3>Budget</h3>
        <p>{niveauxSelectionnes[0].budget}</p>
      </div>

      <div class="detail">
        <h3>Adoption des solutions cyber</h3>
        <p>{niveauxSelectionnes[0].adoptionSolutions}</p>
      </div>

      <div class="detail">
        <h3>Niveau de sécurité</h3>
        <p>{niveauxSelectionnes[0].niveauSecurite}</p>
      </div>

      <div class="detail">
        <h3>La priorité</h3>
        <p>{niveauxSelectionnes[0].priorite}</p>
      </div>
    </div>
  </div>
</section>
