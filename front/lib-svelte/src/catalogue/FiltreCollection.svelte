<script lang="ts">
  import { CollectionGuide } from './Catalogue.types';
  import { rechercheParCollection } from './stores/rechercheParCollection.store';

  const gereCocheExpertiseTechnique = () => {};
</script>

<fieldset>
  <legend>Collection</legend>
  <label>
    <input type="checkbox" value="" on:click={gereCocheExpertiseTechnique} />
    <span class="libelle">Expertise technique</span>
  </label>
  <fieldset>
    <label>
      <input
        type="checkbox"
        value={CollectionGuide.LES_ESSENTIELS}
        bind:group={$rechercheParCollection}
      />
      <span class="libelle">{CollectionGuide.LES_ESSENTIELS}</span>
    </label>
    <label>
      <input
        type="checkbox"
        value={CollectionGuide.LES_FONDAMENTAUX}
        bind:group={$rechercheParCollection}
      />
      <span class="libelle">{CollectionGuide.LES_FONDAMENTAUX}</span>
    </label>
  </fieldset>
  <label>
    <input
      type="checkbox"
      value={CollectionGuide.CRISE_CYBER}
      bind:group={$rechercheParCollection}
    />
    <span class="libelle">{CollectionGuide.CRISE_CYBER}</span>
  </label>
  <label>
    <input
      type="checkbox"
      value={CollectionGuide.GESTION_DES_RISQUES_CYBER}
      bind:group={$rechercheParCollection}
    />
    <span class="libelle">{CollectionGuide.GESTION_DES_RISQUES_CYBER}</span>
  </label>
  <label>
    <input
      type="checkbox"
      value={CollectionGuide.SUPERVISION_DE_SECURITE}
      bind:group={$rechercheParCollection}
    />
    <span class="libelle">{CollectionGuide.SUPERVISION_DE_SECURITE}</span>
  </label>
  <label>
    <input
      type="checkbox"
      value={CollectionGuide.REMEDIATION}
      bind:group={$rechercheParCollection}
    />
    <span class="libelle">{CollectionGuide.REMEDIATION}</span>
  </label>
</fieldset>
