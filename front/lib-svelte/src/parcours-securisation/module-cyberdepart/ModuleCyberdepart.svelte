<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Alerte from '../../ui/Alerte.svelte';
  import BadgeBeta from '../../ui/BadgeBeta.svelte';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../../ui/filAriane';
  import Heros from '../../ui/Heros.svelte';
  import { toasterStore } from '../../ui/toasts/toaster.store';
  import Toaster from '../../ui/toasts/Toaster.svelte';
  import BadgeCyberdepart from '../BadgeCyberdepart.svelte';
  import InterlocuteursParcoursSecurisation from '../InterlocuteursParcoursSecurisation.svelte';
  import MesuresDeModule from '../MesuresDeModule.svelte';
  import ModaleBadgeCyberdepartDebloque from '../ModaleBadgeCyberdepartDebloque.svelte';
  import ModaleRetourUtilisateurSurParcours from '../ModaleRetourUtilisateurSurParcours.svelte';
  import type { ModuleRéponseApi } from '../moduleReponseApi';
  import Progression from '../Progression.svelte';
  import RetourUtilisateurSurParcours from '../RetourUtilisateurSurParcours.svelte';
  import BasculeParcoursComplet from './BasculeParcoursComplet.svelte';
  import ModaleModuleCyberdepartTermine from './ModaleModuleCyberdepartTermine.svelte';

  let modaleRetourMiParcoursOuverte = $state(false);

  let module = $state<ModuleRéponseApi>({
    nom: '',
    description: '',
    mesures: [],
    cibleBadge: 0,
  });
  const totalMesures = $derived(module.mesures.length);
  let badgeCyberdépartDebloqué = $state(false);
  let moduleTerminé = $state(false);
  let animeProgression = $state(false);

  onMount(async () => {
    const reponse = await axios.get<ModuleRéponseApi>(`/api/modules/1`);
    module = reponse.data;
    if (sessionStorage.getItem('mesure-prise-en-compte') === 'true') {
      toasterStore.succes('Mesure déclarée prise en compte', 'Votre progression a été mise à jour.');
      sessionStorage.removeItem('mesure-prise-en-compte');
      animeProgression = true;
    }
    if (sessionStorage.getItem('badge-cyberdepart-debloque') === 'true') {
      badgeCyberdépartDebloqué = true;
      sessionStorage.removeItem('badge-cyberdepart-debloque');
    }
    if (sessionStorage.getItem('module-termine') === 'true') {
      moduleTerminé = true;
      sessionStorage.removeItem('module-termine');
    }
  });

  const progressionActuelle = $derived(module.mesures.filter((module) => module.estPriseEnCompte).length);
  const badgeDebloque = $derived(totalMesures > 0 && progressionActuelle >= (module.cibleBadge ?? 0));
  const parcoursTermine = $derived(totalMesures > 0 && progressionActuelle === totalMesures);
  const propriétésFilAriane: PropriétésFilAriane = [{ nom: 'Protéger mon organisation' }];
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
  theme="pastel"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane)}
>
  {#snippet tags()}
    <BadgeBeta />
  {/snippet}
</Heros>

<ModaleBadgeCyberdepartDebloque
  bind:estOuverte={badgeCyberdépartDebloqué}
  surFermeture={() => {
    modaleRetourMiParcoursOuverte = true;
  }}
/>
<ModaleRetourUtilisateurSurParcours bind:estOuverte={modaleRetourMiParcoursOuverte} typeDeRetour="mi-parcours" />

<ModaleModuleCyberdepartTermine bind:estOuverte={moduleTerminé} />

<dsfr-container>
  <div class="progression">
    {#if parcoursTermine}
      <BasculeParcoursComplet />
    {:else if badgeDebloque && !parcoursTermine}
      <Alerte type="information" taille="md" titre="">
        Complétez votre progression et accédez à des mesures plus avancées pour renforcer vos pratiques, mieux
        structurer vos actions et améliorer votre protection dans la durée.
      </Alerte>
    {/if}
    {#if module.nom !== ''}
      <Progression actuel={progressionActuelle} max={totalMesures} cible={module.cibleBadge} anime={animeProgression}
      ></Progression>
    {/if}
    {#if badgeDebloque}
      <BadgeCyberdepart />
    {/if}
  </div>
</dsfr-container>
<RetourUtilisateurSurParcours />

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
