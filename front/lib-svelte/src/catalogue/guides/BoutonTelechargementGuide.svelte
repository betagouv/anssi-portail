<script lang="ts">
  import type { Guide } from '../Guide.types';

  export let guide: Guide;
</script>

<a href={guide.documents[0].url} target="_blank" class="bouton primaire">
  Télécharger le guide
</a>
