<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import BadgeBeta from '../../ui/BadgeBeta.svelte';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../../ui/filAriane';
  import Heros from '../../ui/Heros.svelte';
  import { toasterStore } from '../../ui/toasts/toaster.store';
  import Toaster from '../../ui/toasts/Toaster.svelte';
  import BadgeCyberdepart from '../BadgeCyberdepart.svelte';
  import InterlocuteursParcoursSecurisation from '../InterlocuteursParcoursSecurisation.svelte';
  import LienRetourAuxModules from '../LienRetourAuxModules.svelte';
  import MesuresDeModule from '../MesuresDeModule.svelte';
  import ModaleBadgeCyberdepartDebloque from '../ModaleBadgeCyberdepartDebloque.svelte';
  import type { ModuleRéponseApi } from '../moduleReponseApi';
  import Progression from '../Progression.svelte';
  import RetourUtilisateurSurParcours from '../RetourUtilisateurSurParcours.svelte';
  import ModaleModuleTermine from './ModaleModuleTermine.svelte';
  import ModaleParcoursTermine from './ModaleParcoursTermine.svelte';

  let module = $state<ModuleRéponseApi>({
    nom: '',
    description: '',
    mesures: [],
  });
  let badgeCyberdépartDebloqué = $state(false);
  let moduleTerminé = $state(false);
  let parcoursTerminé = $state(false);
  const totalMesures = $derived(module.mesures.length);
  let animeProgression = $state(false);

  onMount(async () => {
    const idDuModule = new URL(window.location.href).pathname.split('/').pop();
    const reponse = await axios.get<ModuleRéponseApi>(`/api/modules/${idDuModule}`);
    module = reponse.data;
    if (sessionStorage.getItem('mesure-prise-en-compte') === 'true') {
      toasterStore.succes('Mesure déclarée prise en compte', 'Votre progression a été mise à jour.');
      sessionStorage.removeItem('mesure-prise-en-compte');
      animeProgression = true;
    }

    if (module.cibleBadge !== undefined && sessionStorage.getItem('badge-cyberdepart-debloque') === 'true') {
      badgeCyberdépartDebloqué = true;
      sessionStorage.removeItem('badge-cyberdepart-debloque');
    }
    if (sessionStorage.getItem('parcours-complet-termine') === 'true') {
      parcoursTerminé = true;
      sessionStorage.removeItem('parcours-complet-termine');
      sessionStorage.removeItem('module-termine');
    } else if (sessionStorage.getItem('module-termine') === 'true') {
      moduleTerminé = true;
      sessionStorage.removeItem('module-termine');
    }
  });

  const progressionActuelle = $derived(module.mesures.filter((m) => m.estPriseEnCompte).length);

  const badgeDebloque = $derived(
    module.cibleBadge !== undefined && totalMesures > 0 && progressionActuelle >= module.cibleBadge
  );
  const propriétésFilAriane: PropriétésFilAriane = $derived([
    { nom: 'Protéger mon organisation', lien: '/parcours-complet' },
    { nom: module.nom },
  ]);
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

<ModaleBadgeCyberdepartDebloque bind:estOuverte={badgeCyberdépartDebloqué} />

<ModaleModuleTermine bind:estOuverte={moduleTerminé} />
<ModaleParcoursTermine bind:estOuverte={parcoursTerminé} />

<dsfr-container>
  <div class="progression">
    <LienRetourAuxModules />
    {#if module.nom !== ''}
      <Progression actuel={progressionActuelle} max={totalMesures} cible={module.cibleBadge} anime={animeProgression} />
    {/if}
    {#if badgeDebloque}<BadgeCyberdepart />{/if}
  </div>
</dsfr-container>

<MesuresDeModule mesures={module.mesures} />
<InterlocuteursParcoursSecurisation />
<RetourUtilisateurSurParcours
  peutOuvrirAutomatiquement={module.nom !== '' && !badgeCyberdépartDebloqué && !moduleTerminé && !parcoursTerminé}
/>

<style lang="scss">
  .progression {
    padding-block: 2rem;
    gap: 1.5rem;
    display: flex;
    flex-direction: column;
  }
</style>
