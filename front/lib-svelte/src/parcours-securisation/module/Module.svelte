<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { profilStore } from '../../stores/profil.store';
  import BadgeBêta from '../../ui/BadgeBeta.svelte';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../../ui/filAriane';
  import Héros from '../../ui/Heros.svelte';
  import { toasterStore } from '../../ui/toasts/toaster.store';
  import Toaster from '../../ui/toasts/Toaster.svelte';
  import { évènementsDuParcours } from '../evenementsDuParcours';
  import ÉvènementsViaModaleParcoursComplet from '../evenementsViaModaleParcoursComplet.svelte';
  import InterlocuteursParcoursSecurisation from '../InterlocuteursParcoursSecurisation.svelte';
  import LienRetourAuxModules from '../LienRetourAuxModules.svelte';
  import MesuresDeModule from '../MesuresDeModule.svelte';
  import type { ModuleRéponseApi } from '../moduleReponseApi';
  import Progression from '../Progression.svelte';
  import RetourUtilisateurSurParcours from '../RetourUtilisateurSurParcours.svelte';
  import ModaleModuleTerminé from './ModaleModuleTermine.svelte';

  let module = $state<ModuleRéponseApi>({
    nom: '',
    description: '',
    mesures: [],
  });
  let moduleTerminé = $state(false);
  const totalMesures = $derived(module.mesures.length);
  let animeProgression = $state(false);

  onMount(async () => {
    const idDuModule = new URL(window.location.href).pathname.split('/').pop();
    const réponse = await axios.get<ModuleRéponseApi>(`/api/modules/${idDuModule}`);
    module = réponse.data;
    évènementsDuParcours.traiteMesurePriseEnCompte(() => {
      toasterStore.succes('Mesure déclarée prise en compte', 'Votre progression a été mise à jour.');
      animeProgression = true;
    });

    évènementsDuParcours.traiteModuleTerminé(() => {
      moduleTerminé = true;
    });
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
<Héros
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
    <BadgeBêta />
  {/snippet}
</Héros>

<ModaleModuleTerminé bind:estOuverte={moduleTerminé} />

<dsfr-container>
  <div class="progression">
    <LienRetourAuxModules />
    {#if module.nom !== ''}
      <Progression actuel={progressionActuelle} max={totalMesures} cible={module.cibleBadge} anime={animeProgression} />
    {/if}
  </div>
</dsfr-container>

<MesuresDeModule mesures={module.mesures} />
<InterlocuteursParcoursSecurisation />
<ÉvènementsViaModaleParcoursComplet peutOuvrir={module.nom !== '' && !moduleTerminé} />
<RetourUtilisateurSurParcours />

<style lang="scss">
  .progression {
    padding-block: 2rem;
    gap: 1.5rem;
    display: flex;
    flex-direction: column;
  }
</style>
