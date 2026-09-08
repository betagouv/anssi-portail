<script lang="ts">
  import { afficheParcoursSecurisation } from '$plateforme/environnement';
  import { onMount } from 'svelte';
  import { profilStore } from '../stores/profil.store';

  let redirectionParDéfaut = $state(false);

  onMount(() => {
    const pagePostConnexion = sessionStorage.getItem('pagePostConnexion');
    sessionStorage.removeItem('pagePostConnexion');

    try {
      if (pagePostConnexion) {
        const urlPostConnexion = new URL(pagePostConnexion, window.location.origin);
        if (urlPostConnexion.origin === window.location.origin) {
          const pageSource = sessionStorage.getItem('pageSource');
          if (!urlPostConnexion.searchParams.get('pageSource') && pageSource) {
            urlPostConnexion.searchParams.set('pageSource', pageSource);
          }
          const campagne = sessionStorage.getItem('campagne');
          if (campagne) {
            urlPostConnexion.searchParams.set('campagne', campagne);
          }
          window.location.href = urlPostConnexion.href;
          return;
        }
      }
    } catch {
      // La redirection par défaut est appliquée.
    }

    redirectionParDéfaut = true;
  });

  $effect(() => {
    if (!redirectionParDéfaut) return;

    if (!afficheParcoursSecurisation) {
      window.location.href = '/catalogue';
      return;
    }

    const profil = $profilStore;
    if (!profil) return;

    const parcours = profil.parcoursSecurisation.parcoursActuel;
    const urlRedirection = (() => {
      switch (parcours) {
        case 'complet':
          return '/parcours-complet';
        case 'allégé':
          return '/modules/1';
        default:
          return '/parcours-securisation';
      }
    })();

    window.location.href = urlRedirection;
  });
</script>
