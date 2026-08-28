<script lang="ts">
  import { afficheParcoursSecurisation } from '$plateforme/environnement';
  import { onMount } from 'svelte';
  import { profilStore } from '../stores/profil.store';

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

    const lienParcoursUtilisateur =
      $profilStore?.parcoursSecurisation.parcoursActuel === null
        ? '/parcours-securisation'
        : $profilStore?.parcoursSecurisation.parcoursActuel === 'allégé'
          ? '/modules/1'
          : '/parcours-complet';
    window.location.href = afficheParcoursSecurisation ? lienParcoursUtilisateur : '/catalogue';
  });
</script>
