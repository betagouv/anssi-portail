<script lang="ts">
  import { onMount } from 'svelte';
  import { profilStore } from '../stores/profil.store';
  import { stockageDeSession } from '../utils/stockageDeSession';

  let redirectionParDéfaut = $state(false);

  onMount(() => {
    const pagePostConnexion = stockageDeSession.getItem('pagePostConnexion');
    stockageDeSession.supprimeItem('pagePostConnexion');

    try {
      if (pagePostConnexion) {
        const urlPostConnexion = new URL(pagePostConnexion, window.location.origin);
        if (urlPostConnexion.origin === window.location.origin) {
          const pageSource = stockageDeSession.getItem('pageSource');
          if (!urlPostConnexion.searchParams.get('pageSource') && pageSource) {
            urlPostConnexion.searchParams.set('pageSource', pageSource);
          }
          const campagne = stockageDeSession.getItem('campagne');
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
