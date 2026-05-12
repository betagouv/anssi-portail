<script lang="ts">
  import { Source } from './Catalogue.types';
  import ChoixFiltreSource from './ChoixFiltreSource.svelte';
  import { nombreResultats } from './stores/nombreResultats.store';
  import { rechercheParSource } from './stores/rechercheParSource.store';

  let anssiPartielles = false;
  $: if (
    $rechercheParSource.includes(Source.CERTFR) ||
    $rechercheParSource.includes(Source.INNOVATION_ANSSI) ||
    $rechercheParSource.includes(Source.ANSSI)
  ) {
    anssiPartielles = !(
      $rechercheParSource.includes(Source.CERTFR) &&
      $rechercheParSource.includes(Source.INNOVATION_ANSSI) &&
      $rechercheParSource.includes(Source.ANSSI)
    );
    rechercheParSource.ajoute(Source.ANSSI_TOUTES);
  } else {
    anssiPartielles = false;
    rechercheParSource.retire(Source.ANSSI_TOUTES);
  }

  const gereCocheANSSI = () => {
    if (!$rechercheParSource.includes(Source.ANSSI_TOUTES)) {
      rechercheParSource.ajoute(Source.CERTFR);
      rechercheParSource.ajoute(Source.INNOVATION_ANSSI);
      rechercheParSource.ajoute(Source.ANSSI);
    } else {
      rechercheParSource.retire(Source.CERTFR);
      rechercheParSource.retire(Source.INNOVATION_ANSSI);
      rechercheParSource.retire(Source.ANSSI);
    }
  };

  $: cocheToutesLesSources = $rechercheParSource.includes(Source.ANSSI_TOUTES);
</script>

<fieldset>
  <legend>Source</legend>
  <label>
    <input
      type="checkbox"
      value={Source.ANSSI_TOUTES}
      bind:indeterminate={anssiPartielles}
      checked={cocheToutesLesSources}
      on:click={gereCocheANSSI}
    />
    <span class="libelle">Toutes les sources ANSSI</span>
    <span class="compte">{$nombreResultats.parSource[Source.ANSSI_TOUTES]}</span>
  </label>
  <fieldset>
    <ChoixFiltreSource valeur={Source.CERTFR} libelle="CERT-FR" />
    <ChoixFiltreSource valeur={Source.INNOVATION_ANSSI} libelle="Innovation ANSSI" />
    <ChoixFiltreSource valeur={Source.ANSSI} libelle="ANSSI" />
  </fieldset>
  <ChoixFiltreSource valeur={Source.PARTENAIRES} libelle="Partenaires" />
</fieldset>
