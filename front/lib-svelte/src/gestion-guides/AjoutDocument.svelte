<script lang="ts">
  import { clic } from '../directives/actions.svelte';

  const ajoute = async () => {
    // await axios.post('/api/gestion-guides/guides/xxxxxx/documents');
  };
</script>

<dsfr-container>
  <dsfr-button label="Ajouter" use:clic={ajoute}></dsfr-button>
</dsfr-container>
