<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Heros from '../ui/Heros.svelte';
  import { toasterStore } from '../ui/toasts/toaster.store';
  import Toaster from '../ui/toasts/Toaster.svelte';
  import GrilleCartesMesures from './GrilleCartesMesures.svelte';
  import type { Mesure } from './mesure';
  import Progression from './Progression.svelte';

  let mesures: Mesure[] = $state([]);
  const totalMesures = $derived(mesures.length);
  let cibleBadge = $state(0);

  onMount(async () => {
    const reponse = await axios.get<{ cibleBadge: number; mesures: Mesure[] }>(`/api/modules/2`);
    mesures = reponse.data.mesures;
    cibleBadge = reponse.data.cibleBadge;
    if (sessionStorage.getItem('mesure-prise-en-compte') === 'true') {
      toasterStore.succes('Mesure déclarée prise en compte', 'Mesure déclarée prise en compte');
      sessionStorage.removeItem('mesure-prise-en-compte');
    }
  });
  const mesuresMisesEnAvant = $derived(mesures.filter((_, index) => index < 4));
  const autresMesures = $derived(mesures.filter((_, index) => index >= 4));
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

<dsfr-container class="actions-en-avant">
  <h4>🚀 Lancez-vous avec ces premières actions</h4>
  <GrilleCartesMesures mesures={mesuresMisesEnAvant}></GrilleCartesMesures>
</dsfr-container>

<dsfr-container class="autres-actions">
  <GrilleCartesMesures mesures={autresMesures}></GrilleCartesMesures>
</dsfr-container>

<style lang="scss">
  .progression {
    padding-block: 2rem;
    gap: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  dsfr-container.actions-en-avant {
    background-color: var(--background-alt-blue-france);
    padding-block: 3rem;

    h4 {
      margin-bottom: 2rem;
    }
  }

  .autres-actions {
    padding-block: 3rem;
  }
</style>
