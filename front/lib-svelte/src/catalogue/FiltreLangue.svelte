<script lang="ts">
  import { Langue } from './Catalogue.types';
  import { nombreGuides } from './stores/nombreGuides.store';
  import { rechercheParLangue } from './stores/rechercheParLangue.store';
</script>

<fieldset>
  <legend>Langue</legend>
  <label>
    <input type="checkbox" value={Langue.FR} bind:group={$rechercheParLangue} />
    <span class="libelle">Français</span>
    <span class="compte">{$nombreGuides.parLangue[Langue.FR]}</span>
  </label>
  <label>
    <input type="checkbox" value={Langue.EN} bind:group={$rechercheParLangue} />
    <span class="libelle">Anglais</span>
    <span class="compte">{$nombreGuides.parLangue[Langue.EN]}</span>
  </label>
</fieldset>
