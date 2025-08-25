<script lang="ts">
  import { Source } from './Catalogue.types';
  import { rechercheParSource } from './stores/rechercheParSource.store';
  import { nombreResultats } from './stores/nombreResultats.store';

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
</script>

<fieldset>
  <legend>Source</legend>
  <label>
    <input
      type="checkbox"
      value={Source.ANSSI_TOUTES}
      bind:indeterminate={anssiPartielles}
      bind:group={$rechercheParSource}
      on:click={gereCocheANSSI}
    />
    <span class="libelle">Toutes les sources ANSSI</span>
    <span class="compte">{$nombreResultats.parSource[Source.ANSSI_TOUTES]}</span>
  </label>
  <fieldset>
    <label>
      <input
        type="checkbox"
        value={Source.CERTFR}
        bind:group={$rechercheParSource}
      />
      <span class="libelle">CERT-FR</span>
      <span class="compte">{$nombreResultats.parSource[Source.CERTFR]}</span>
    </label>
    <label>
      <input
        type="checkbox"
        value={Source.INNOVATION_ANSSI}
        bind:group={$rechercheParSource}
      />
      <span class="libelle">Innovation ANSSI</span>
      <span class="compte"
        >{$nombreResultats.parSource[Source.INNOVATION_ANSSI]}</span
      >
    </label>
    <label>
      <input
        type="checkbox"
        value={Source.ANSSI}
        bind:group={$rechercheParSource}
      />
      <span class="libelle">ANSSI</span>
      <span class="compte"
      >{$nombreResultats.parSource[Source.ANSSI]}</span
      >
    </label>
  </fieldset>
  <label>
    <input
      type="checkbox"
      value={Source.PARTENAIRES}
      bind:group={$rechercheParSource}
    />
    <span class="libelle">Partenaires</span>
    <span class="compte">{$nombreResultats.parSource[Source.PARTENAIRES]}</span>
  </label>
</fieldset>
