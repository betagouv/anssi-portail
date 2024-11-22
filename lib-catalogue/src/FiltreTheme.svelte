<script lang="ts">
  import {  ThemeCyber } from "./Catalogue.types";
  import { rechercheParTheme } from "./stores/rechercheParTheme.store";
</script>

<fieldset>
  <legend>Thèmes cyber</legend>
  <label>
    <input
      type="checkbox"
      value={ThemeCyber.GOUVERNANCE}
      bind:group={$rechercheParTheme}
    />
    <span class="libelle">Gouvernance</span>
    <span class="compte">55</span>
  </label>
  <label>
    <input
      type="checkbox"
      value={ThemeCyber.DEFENSE}
      bind:group={$rechercheParTheme}
    />
    <span class="libelle">Défense</span>
    <span class="compte">55</span>
  </label>
  <label>
    <input
      type="checkbox"
      value={ThemeCyber.PROTECTION}
      bind:group={$rechercheParTheme}
    />
    <span class="libelle">Protection</span>
    <span class="compte">55</span>
  </label>
  <label>
    <input
      type="checkbox"
      value={ThemeCyber.RESILIENCE}
      bind:group={$rechercheParTheme}
    />
    <span class="libelle">Résilience</span>
    <span class="compte">55</span>
  </label>
</fieldset>
