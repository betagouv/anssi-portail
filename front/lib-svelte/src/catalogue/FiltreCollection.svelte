<script lang="ts">
  import CaseACocherDeCollection from './CaseACocherDeCollection.svelte';
  import { CollectionGuide } from './Catalogue.types';
  import { nombreGuides } from './stores/nombreGuides.store';
  import { rechercheParCollection } from './stores/rechercheParCollection.store';

  $: toutesLesExpertisesTechniques =
    $rechercheParCollection.includes(CollectionGuide.LES_ESSENTIELS) &&
    $rechercheParCollection.includes(CollectionGuide.LES_FONDAMENTAUX);

  $: quelquesExpertisesTechniques =
    $rechercheParCollection.includes(CollectionGuide.LES_ESSENTIELS) ||
    $rechercheParCollection.includes(CollectionGuide.LES_FONDAMENTAUX);

  $: unePartieSeulementDesExpertisesTechniques =
    !toutesLesExpertisesTechniques && quelquesExpertisesTechniques;

  const gereCocheExpertiseTechnique = () => {
    if (toutesLesExpertisesTechniques) {
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
      checked={quelquesExpertisesTechniques}
      indeterminate={unePartieSeulementDesExpertisesTechniques}
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
    <CaseACocherDeCollection collection={CollectionGuide.LES_ESSENTIELS} />
    <CaseACocherDeCollection collection={CollectionGuide.LES_FONDAMENTAUX} />
  </fieldset>
  <CaseACocherDeCollection collection={CollectionGuide.CRISE_CYBER} />
  <CaseACocherDeCollection
    collection={CollectionGuide.GESTION_DES_RISQUES_CYBER}
  />
  <CaseACocherDeCollection
    collection={CollectionGuide.SUPERVISION_DE_SECURITE}
  />
  <CaseACocherDeCollection collection={CollectionGuide.REMEDIATION} />
</fieldset>
