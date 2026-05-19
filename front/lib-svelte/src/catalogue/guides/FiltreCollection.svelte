<script lang="ts">
  import CaseACocher from '../../ui/CaseACocher.svelte';
  import { CollectionGuide } from '../Guide.types';
  import { nombreGuides } from '../stores/guides/nombreGuides.store';
  import { rechercheParCollection } from '../stores/guides/rechercheParCollection.store';
  import ChoixFiltreCollection from './ChoixFiltreCollection.svelte';

  $: toutesLesExpertisesTechniques =
    $rechercheParCollection.includes(CollectionGuide.LES_ESSENTIELS) &&
    $rechercheParCollection.includes(CollectionGuide.LES_FONDAMENTAUX) &&
    $rechercheParCollection.includes(CollectionGuide.IA) &&
    $rechercheParCollection.includes(CollectionGuide.SYSTEMES_INDUSTRIELS) &&
    $rechercheParCollection.includes(CollectionGuide.CRYPTOGRAPHIE) &&
    $rechercheParCollection.includes(CollectionGuide.AUTRE);

  $: quelquesExpertisesTechniques =
    $rechercheParCollection.includes(CollectionGuide.LES_ESSENTIELS) ||
    $rechercheParCollection.includes(CollectionGuide.LES_FONDAMENTAUX) ||
    $rechercheParCollection.includes(CollectionGuide.IA) ||
    $rechercheParCollection.includes(CollectionGuide.SYSTEMES_INDUSTRIELS) ||
    $rechercheParCollection.includes(CollectionGuide.CRYPTOGRAPHIE) ||
    $rechercheParCollection.includes(CollectionGuide.AUTRE);

  $: unePartieSeulementDesExpertisesTechniques = !toutesLesExpertisesTechniques && quelquesExpertisesTechniques;

  const gereCocheExpertiseTechnique = () => {
    if (toutesLesExpertisesTechniques) {
      rechercheParCollection.retire([
        CollectionGuide.LES_ESSENTIELS,
        CollectionGuide.LES_FONDAMENTAUX,
        CollectionGuide.IA,
        CollectionGuide.CRYPTOGRAPHIE,
        CollectionGuide.SYSTEMES_INDUSTRIELS,
        CollectionGuide.AUTRE,
      ]);
    } else {
      rechercheParCollection.ajoute([
        CollectionGuide.LES_ESSENTIELS,
        CollectionGuide.LES_FONDAMENTAUX,
        CollectionGuide.IA,
        CollectionGuide.CRYPTOGRAPHIE,
        CollectionGuide.SYSTEMES_INDUSTRIELS,
        CollectionGuide.AUTRE,
      ]);
    }
  };
</script>

<fieldset>
  <legend>Collection</legend>
  <div class="choix">
    <CaseACocher
      id="expertise-technique"
      libelle="Expertise technique"
      coche={quelquesExpertisesTechniques}
      indetermine={unePartieSeulementDesExpertisesTechniques}
      change={gereCocheExpertiseTechnique}
    />
    <span class="compte">
      {($nombreGuides.parCollection[CollectionGuide.LES_ESSENTIELS] ?? 0) +
        ($nombreGuides.parCollection[CollectionGuide.LES_FONDAMENTAUX] ?? 0) +
        ($nombreGuides.parCollection[CollectionGuide.SYSTEMES_INDUSTRIELS] ?? 0) +
        ($nombreGuides.parCollection[CollectionGuide.IA] ?? 0) +
        ($nombreGuides.parCollection[CollectionGuide.CRYPTOGRAPHIE] ?? 0) +
        ($nombreGuides.parCollection[CollectionGuide.AUTRE] ?? 0)}
    </span>
  </div>
  <fieldset>
    <ChoixFiltreCollection valeur={CollectionGuide.LES_ESSENTIELS} />
    <ChoixFiltreCollection valeur={CollectionGuide.LES_FONDAMENTAUX} />
    <ChoixFiltreCollection valeur={CollectionGuide.CRYPTOGRAPHIE} />
    <ChoixFiltreCollection valeur={CollectionGuide.IA} />
    <ChoixFiltreCollection valeur={CollectionGuide.SYSTEMES_INDUSTRIELS} />
    <ChoixFiltreCollection valeur={CollectionGuide.AUTRE} />
  </fieldset>
  <ChoixFiltreCollection valeur={CollectionGuide.CRISE_CYBER} />
  <ChoixFiltreCollection valeur={CollectionGuide.GESTION_DES_RISQUES_CYBER} />
  <ChoixFiltreCollection valeur={CollectionGuide.SUPERVISION_DE_SECURITE} />
  <ChoixFiltreCollection valeur={CollectionGuide.REMEDIATION} />
</fieldset>
