<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Kit de sensibilisation interne' };
</script>

<Heros
  description="Un plan de sensibilisation avec 6 thématiques (affiches et courriels) à déployer au rythme de votre organisation. L’ordre proposé suit une progression logique."
  format="banniere"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane, !!$profilStore)}
  theme="clair"
  titre="Kit de sensibilisation interne"
/>
