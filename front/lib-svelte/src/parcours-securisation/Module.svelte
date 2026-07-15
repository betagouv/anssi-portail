<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Heros from '../ui/Heros.svelte';
  import { toasterStore } from '../ui/toasts/toaster.store';
  import Toaster from '../ui/toasts/Toaster.svelte';
  import type { Mesure } from './mesure';
  import MesuresDeModule from './MesuresDeModule.svelte';
  import Progression from './Progression.svelte';

  let mesures: Mesure[] = $state([]);
  const totalMesures = $derived(mesures.length);
  let cibleBadge = $state(0);

  onMount(async () => {
    const idDuModule = new URL(window.location.href).pathname.split('/').pop();
    const reponse = await axios.get<{ cibleBadge: number; mesures: Mesure[] }>(`/api/modules/${idDuModule}`);
    mesures = reponse.data.mesures;
    cibleBadge = reponse.data.cibleBadge;
    if (sessionStorage.getItem('mesure-prise-en-compte') === 'true') {
      toasterStore.succes('Mesure déclarée prise en compte', 'Mesure déclarée prise en compte');
      sessionStorage.removeItem('mesure-prise-en-compte');
    }
  });

  const progressionActuelle = $derived(mesures.filter((m) => m.estPriseEnCompte).length);
</script>

<Toaster />
<Heros
  cacheActions={true}
  cacheIllustration={true}
  cacheTags={true}
  description="Avancez à votre rythme dans une première démarche de sécurisation et appliquez les recommandations essentielles pour réduire les risques cyber du quotidien."
  format="banniere"
  illustrationAlt=""
  illustrationSource=""
  titre="nom du module"
  theme="sombre"
></Heros>

<dsfr-container>
  <div class="progression">
    <Progression actuel={progressionActuelle} max={totalMesures} cible={cibleBadge}></Progression>
  </div>
</dsfr-container>

<MesuresDeModule {mesures} />

<style lang="scss">
  .progression {
    padding-block: 2rem;
    gap: 1.5rem;
    display: flex;
    flex-direction: column;
  }
</style>
