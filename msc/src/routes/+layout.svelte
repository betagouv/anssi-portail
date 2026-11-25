<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import Entete from '$lib/Entete.svelte';
  import Metadonnees from '$lib/Metadonnees.svelte';
  import PiedDePage from '$lib/PiedDePage.svelte';
  import AvisUtilisateur from '$msc/avis-utilisateur/AvisUtilisateur.svelte';
  import {
    ControleAvisUtilisateur,
    entrepotNavigateurAvisUtilisateur,
  } from '$msc/avis-utilisateur/ControleAvisUtilisateur';
  import CentreAide from '$msc/centre-aide/CentreAide.svelte';
  import BandeauMaintenance from '$msc/maintenance/BandeauMaintenance.svelte';
  import { verifieResultatTestARevendiquer } from '$msc/test-maturite/resultatTest';
  import { onMount, setContext } from 'svelte';
  import { toStore } from 'svelte/store';
  import type { LayoutProps } from './$types';

  let { data, children }: LayoutProps = $props();
  setContext(
    'profilMSC',
    toStore(() => data.profil)
  );
  let avisVisible = $state(false);
  const cdn =
    'https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com/' + import.meta.env.VERSION_KIT_UI;
  onMount(() => {
    if (data.profil) void verifieResultatTestARevendiquer();
    const avis = new ControleAvisUtilisateur({
      dureeMinimumEnSecondes: data.delaiAvis,
      entrepotAvisUtilisateur: entrepotNavigateurAvisUtilisateur,
    });
    if (avis.proposeAvisUtilisteur()) {
      const minuterie = setTimeout(() => {
        avisVisible = true;
      }, avis.calculeDelaiRestantAvisUtilisateur() * 1000);
      return () => clearTimeout(minuterie);
    }
  });
  afterNavigate(({ from, to }) => {
    if (!to) return;
    sessionStorage.setItem('pageSource', to.url.pathname);
    const campagne = to.url.searchParams.get('mtm_campaign') || to.url.searchParams.get('utm_campaign');
    if (campagne) sessionStorage.setItem('campagne', campagne);
    if (
      from &&
      from.url.pathname !== to.url.pathname &&
      data.matomo &&
      localStorage.getItem('optOutMatomo') !== 'true'
    ) {
      window._paq?.push(['setCustomUrl', to.url.href]);
      window._paq?.push(['setDocumentTitle', document.title]);
      window._paq?.push(['trackPageView']);
    }
  });
</script>

<svelte:head>
  <link rel="stylesheet" href={cdn + '/dsfr-variables.css'} />
  <link rel="stylesheet" href={cdn + '/dsfr-icons.css'} />
  {#if data.verification}<meta name="google-site-verification" content={data.verification} />{/if}
  {#if data.matomo}<script
      type="module"
      id="script-matomo"
      data-id-site-matomo={data.matomo}
      src="/scripts/matomo.js"
    ></script>{/if}
  {#if data.tagManager}<script
      type="module"
      id="script-matomo-tag-manager"
      data-url-tag-manager-matomo={data.tagManager}
      src="/scripts/matomoTagManager.js"
    ></script>{/if}
  {#if data.sentry}<meta id="script-sentry" data-dsn={data.sentry} data-environnement={data.environnementSentry} />{/if}
</svelte:head>
<Metadonnees origine={data.origine} />
<div class="entete-msc"><Entete chemin={page.url.pathname} /></div>
<main id="contenu">
  <BandeauMaintenance prevision={data.maintenance} />
  {#if avisVisible}<AvisUtilisateur />{/if}
  <CentreAide />
  {@render children()}
</main>
<div class="pied-de-page-msc"><PiedDePage /></div>
