<script lang="ts">
  import { rechercheParDroitAcces } from "./stores/rechercheParDroitAcces.store";
  import { DroitAcces } from "./Catalogue.types";
  import { nombreResultats } from "./stores/nombreResultats.store";
</script>

<fieldset>
  <legend>Accessibles pour</legend>
  <label>
    <input
      type="checkbox"
      value={DroitAcces.ACCES_LIBRE}
      bind:group={$rechercheParDroitAcces}
    />
    <span class="libelle">Accès libre</span>
    <span class="compte"
      >{$nombreResultats.parDroitAcces[DroitAcces.ACCES_LIBRE]}</span
    >
  </label>
  <label>
    <input
      type="checkbox"
      value={DroitAcces.ENTITES_PUBLIQUES}
      bind:group={$rechercheParDroitAcces}
    />
    <span class="libelle">Entités publiques</span>
    <span class="compte"
      >{$nombreResultats.parDroitAcces[DroitAcces.ENTITES_PUBLIQUES]}</span
    >
  </label>
  <label>
    <input
      type="checkbox"
      value={DroitAcces.REGULES_NIS2}
      bind:group={$rechercheParDroitAcces}
    />
    <span class="libelle">Entités régulées / NIS2</span>
    <span class="compte"
      >{$nombreResultats.parDroitAcces[DroitAcces.REGULES_NIS2]}</span
    >
  </label>
</fieldset>
