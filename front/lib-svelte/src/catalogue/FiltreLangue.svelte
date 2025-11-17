<script lang="ts">
  import { Langue } from './Catalogue.types';
  import { rechercheParLangue } from './stores/rechercheParLangue.store';
</script>

<fieldset>
  <legend>Langue</legend>
  <label>
    <input type="checkbox" value={Langue.FR} bind:group={$rechercheParLangue} />
    <span class="libelle">Français</span>
  </label>
  <label>
    <input type="checkbox" value={Langue.EN} bind:group={$rechercheParLangue} />
    <span class="libelle">Anglais</span>
  </label>
</fieldset>
