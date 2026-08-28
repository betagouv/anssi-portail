<script lang="ts">
  import { onMount } from 'svelte';

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

    window.location.href = '/catalogue';
  });
</script>
