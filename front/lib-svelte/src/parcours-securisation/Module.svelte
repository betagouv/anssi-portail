<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Heros from '../ui/Heros.svelte';
  import { toasterStore } from '../ui/toasts/toaster.store';
  import Toaster from '../ui/toasts/Toaster.svelte';
  import type { Mesure } from './mesure';
  import MesuresDeModule from './MesuresDeModule.svelte';
  import Progression from './Progression.svelte';

  type ModuleRéponseApi = {
    nom: string;
    cibleBadge?: number;
    mesures: Mesure[];
  };

  let module = $state<ModuleRéponseApi>({
    nom: '',
    mesures: [],
  });
  const totalMesures = $derived(module.mesures.length);

  onMount(async () => {
    const idDuModule = new URL(window.location.href).pathname.split('/').pop();
    const reponse = await axios.get<ModuleRéponseApi>(`/api/modules/${idDuModule}`);
    module = reponse.data;
    if (sessionStorage.getItem('mesure-prise-en-compte') === 'true') {
      toasterStore.succes('Mesure déclarée prise en compte', 'Mesure déclarée prise en compte');
      sessionStorage.removeItem('mesure-prise-en-compte');
    }
  });

  const progressionActuelle = $derived(module.mesures.filter((m) => m.estPriseEnCompte).length);
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
  titre={module.nom}
  theme="sombre"
></Heros>

<dsfr-container>
  <div class="progression">
    <Progression actuel={progressionActuelle} max={totalMesures} cible={module.cibleBadge}></Progression>
  </div>
</dsfr-container>

<MesuresDeModule mesures={module.mesures} />

<style lang="scss">
  .progression {
    padding-block: 2rem;
    gap: 1.5rem;
    display: flex;
    flex-direction: column;
  }
</style>
