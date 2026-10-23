<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Intégrer nos dispositifs' };
</script>

<Heros
  description="Enrichissez votre site avec des outils et services cyber gratuits, simples à intégrer et accessibles à tous."
  format="banniere"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane, !!$profilStore)}
  theme="clair"
  titre="Intégrer nos dispositifs"
/>
