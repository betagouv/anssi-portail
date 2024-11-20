<script lang="ts">
  import { rechercheParDroitAcces } from "./stores/rechercheParDroitAcces.store";
  import { DroitAcces } from "./Catalogue.types";
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
    <span class="compte">71</span>
  </label>
  <label>
    <input
      type="checkbox"
      value={DroitAcces.ENTITES_PUBLIQUES}
      bind:group={$rechercheParDroitAcces}
    />
    <span class="libelle">Entités publiques</span>
    <span class="compte">55</span>
  </label>
  <label>
    <input
      type="checkbox"
      value={DroitAcces.REGULES_NIS2}
      bind:group={$rechercheParDroitAcces}
    />
    <span class="libelle">Entités régulées / NIS2</span>
    <span class="compte">4</span>
  </label>
</fieldset>
