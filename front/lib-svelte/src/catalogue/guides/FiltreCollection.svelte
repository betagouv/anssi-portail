<script lang="ts">
  import { CollectionGuide } from '../Guide.types';
  import { nombreGuides } from '../stores/guides/nombreGuides.store';
  import { rechercheParCollection } from '../stores/guides/rechercheParCollection.store';
  import ChoixFiltreCollection from './ChoixFiltreCollection.svelte';

  $: toutesLesExpertisesTechniques =
    $rechercheParCollection.includes(CollectionGuide.LES_ESSENTIELS) &&
    $rechercheParCollection.includes(CollectionGuide.LES_FONDAMENTAUX) &&
    $rechercheParCollection.includes(CollectionGuide.AUTRE);

  $: quelquesExpertisesTechniques =
    $rechercheParCollection.includes(CollectionGuide.LES_ESSENTIELS) ||
    $rechercheParCollection.includes(CollectionGuide.LES_FONDAMENTAUX) ||
    $rechercheParCollection.includes(CollectionGuide.AUTRE);

  $: unePartieSeulementDesExpertisesTechniques = !toutesLesExpertisesTechniques && quelquesExpertisesTechniques;

  const gereCocheExpertiseTechnique = () => {
    if (toutesLesExpertisesTechniques) {
      rechercheParCollection.retire([
        CollectionGuide.LES_ESSENTIELS,
        CollectionGuide.LES_FONDAMENTAUX,
        CollectionGuide.AUTRE,
      ]);
    } else {
      rechercheParCollection.ajoute([
        CollectionGuide.LES_ESSENTIELS,
        CollectionGuide.LES_FONDAMENTAUX,
        CollectionGuide.AUTRE,
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
        ($nombreGuides.parCollection[CollectionGuide.LES_FONDAMENTAUX] ?? 0) +
        ($nombreGuides.parCollection[CollectionGuide.AUTRE] ?? 0)}
    </span>
  </label>
  <fieldset>
    <ChoixFiltreCollection valeur={CollectionGuide.LES_ESSENTIELS} />
    <ChoixFiltreCollection valeur={CollectionGuide.LES_FONDAMENTAUX} />
    <ChoixFiltreCollection valeur={CollectionGuide.AUTRE} />
  </fieldset>
  <ChoixFiltreCollection valeur={CollectionGuide.CRISE_CYBER} />
  <ChoixFiltreCollection valeur={CollectionGuide.GESTION_DES_RISQUES_CYBER} />
  <ChoixFiltreCollection valeur={CollectionGuide.SUPERVISION_DE_SECURITE} />
  <ChoixFiltreCollection valeur={CollectionGuide.REMEDIATION} />
</fieldset>
