<script lang="ts">
  import { CollectionGuide } from './Catalogue.types';
  import { nombreGuides } from './stores/nombreGuides.store';
  import { rechercheParCollection } from './stores/rechercheParCollection.store';

  $: toutesLesExpertiseTechnique =
    $rechercheParCollection.includes(CollectionGuide.LES_ESSENTIELS) &&
    $rechercheParCollection.includes(CollectionGuide.LES_FONDAMENTAUX);

  $: quelquesExpertiseTechnique =
    !toutesLesExpertiseTechnique &&
    ($rechercheParCollection.includes(CollectionGuide.LES_ESSENTIELS) ||
      $rechercheParCollection.includes(CollectionGuide.LES_FONDAMENTAUX));

  const gereCocheExpertiseTechnique = () => {
    if (toutesLesExpertiseTechnique) {
      rechercheParCollection.retire([
        CollectionGuide.LES_ESSENTIELS,
        CollectionGuide.LES_FONDAMENTAUX,
      ]);
    } else {
      rechercheParCollection.ajoute([
        CollectionGuide.LES_ESSENTIELS,
        CollectionGuide.LES_FONDAMENTAUX,
      ]);
    }
  };
</script>

<fieldset>
  <legend>Collection</legend>
  <label>
    <input
      checked={toutesLesExpertiseTechnique || quelquesExpertiseTechnique}
      indeterminate={quelquesExpertiseTechnique}
      on:click={gereCocheExpertiseTechnique}
      type="checkbox"
    />
    <span class="libelle">Expertise technique</span>
    <span class="compte">
      {($nombreGuides.parCollection[CollectionGuide.LES_ESSENTIELS] ?? 0) +
        ($nombreGuides.parCollection[CollectionGuide.LES_FONDAMENTAUX] ?? 0)}
    </span>
  </label>
  <fieldset>
    <label>
      <input
        type="checkbox"
        value={CollectionGuide.LES_ESSENTIELS}
        bind:group={$rechercheParCollection}
      />
      <span class="libelle">{CollectionGuide.LES_ESSENTIELS}</span>
      <span class="compte">
        {$nombreGuides.parCollection[CollectionGuide.LES_ESSENTIELS]}
      </span>
    </label>
    <label>
      <input
        type="checkbox"
        value={CollectionGuide.LES_FONDAMENTAUX}
        bind:group={$rechercheParCollection}
      />
      <span class="libelle">{CollectionGuide.LES_FONDAMENTAUX}</span>
      <span class="compte">
        {$nombreGuides.parCollection[CollectionGuide.LES_FONDAMENTAUX]}
      </span>
    </label>
  </fieldset>
  <label>
    <input
      type="checkbox"
      value={CollectionGuide.CRISE_CYBER}
      bind:group={$rechercheParCollection}
    />
    <span class="libelle">{CollectionGuide.CRISE_CYBER}</span>
    <span class="compte">
      {$nombreGuides.parCollection[CollectionGuide.CRISE_CYBER]}
    </span>
  </label>
  <label>
    <input
      type="checkbox"
      value={CollectionGuide.GESTION_DES_RISQUES_CYBER}
      bind:group={$rechercheParCollection}
    />
    <span class="libelle">{CollectionGuide.GESTION_DES_RISQUES_CYBER}</span>
    <span class="compte">
      {$nombreGuides.parCollection[CollectionGuide.GESTION_DES_RISQUES_CYBER]}
    </span>
  </label>
  <label>
    <input
      type="checkbox"
      value={CollectionGuide.SUPERVISION_DE_SECURITE}
      bind:group={$rechercheParCollection}
    />
    <span class="libelle">{CollectionGuide.SUPERVISION_DE_SECURITE}</span>
    <span class="compte">
      {$nombreGuides.parCollection[CollectionGuide.SUPERVISION_DE_SECURITE]}
    </span>
  </label>
  <label>
    <input
      type="checkbox"
      value={CollectionGuide.REMEDIATION}
      bind:group={$rechercheParCollection}
    />
    <span class="libelle">{CollectionGuide.REMEDIATION}</span>
    <span class="compte">
      {$nombreGuides.parCollection[CollectionGuide.REMEDIATION]}
    </span>
  </label>
</fieldset>
