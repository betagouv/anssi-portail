document.addEventListener('DOMContentLoaded', () => {
  const pagePostConnexion = sessionStorage.getItem('pagePostConnexion');
  sessionStorage.removeItem('pagePostConnexion');

  try {
    if (pagePostConnexion) {
      const urlPostConnexion = new URL(pagePostConnexion, window.location.origin);
      if (urlPostConnexion.origin === window.location.origin) {
        if (!urlPostConnexion.searchParams.get('pageSource')) {
          urlPostConnexion.searchParams.set('pageSource', sessionStorage.getItem('pageSource'));
        }
        const campagne = sessionStorage.getItem('campagne');
        if (campagne) {
          urlPostConnexion.searchParams.set('campagne', campagne);
        }
        window.location = urlPostConnexion.href;
        return;
      }
    }
  } catch {
    // La redirection par défaut est appliquée.
  }

  window.location = '/catalogue';
});
