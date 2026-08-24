<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { profilStore } from '../stores/profil.store';
  import BadgeBeta from '../ui/BadgeBeta.svelte';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';
  import { toasterStore } from '../ui/toasts/toaster.store';
  import Toaster from '../ui/toasts/Toaster.svelte';
  import InterlocuteursParcoursSecurisation from './InterlocuteursParcoursSecurisation.svelte';
  import MesuresDeModule from './MesuresDeModule.svelte';
  import type { ModuleRéponseApi } from './moduleReponseApi';
  import Progression from './Progression.svelte';

  let module = $state<ModuleRéponseApi>({
    nom: '',
    description: '',
    mesures: [],
  });
  const totalMesures = $derived(module.mesures.length);

  onMount(async () => {
    const idDuModule = new URL(window.location.href).pathname.split('/').pop();
    const reponse = await axios.get<ModuleRéponseApi>(`/api/modules/${idDuModule}`);
    module = reponse.data;
    if (sessionStorage.getItem('mesure-prise-en-compte') === 'true') {
      toasterStore.succes('Mesure déclarée prise en compte', 'Votre progression a été mise à jour.');
      sessionStorage.removeItem('mesure-prise-en-compte');
    }
  });

  const progressionActuelle = $derived(module.mesures.filter((m) => m.estPriseEnCompte).length);

  const propriétésFilAriane: PropriétésFilAriane = $derived(
    $profilStore?.parcoursSecurisation.parcoursActuel === 'allégé'
      ? [
          {
            nom: 'Protéger mon organisation',
          },
        ]
      : [
          {
            nom: 'Protéger mon organisation',
            lien: '/parcours-complet',
          },
          {
            nom: module.nom,
          },
        ]
  );
</script>

<Toaster />
<Heros
  cacheActions={true}
  cacheIllustration={true}
  cacheTags={true}
  description={module.description}
  format="banniere"
  illustrationAlt=""
  illustrationSource=""
  titre={module.nom}
  theme="clair"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane)}
>
  {#snippet tags()}
    <BadgeBeta />
  {/snippet}
</Heros>

<dsfr-container>
  <div class="progression">
    <Progression actuel={progressionActuelle} max={totalMesures} cible={module.cibleBadge}></Progression>
  </div>
</dsfr-container>

<MesuresDeModule mesures={module.mesures} />
<InterlocuteursParcoursSecurisation />

<style lang="scss">
  .progression {
    padding-block: 2rem;
    gap: 1.5rem;
    display: flex;
    flex-direction: column;
  }
</style>
