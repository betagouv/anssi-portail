document.addEventListener('DOMContentLoaded', () => {
  sessionStorage.removeItem('pagePostConnexion');
  const paramètresRecherche = new URLSearchParams(window.location.search);

  const urlRedirection = paramètresRecherche.get('urlRedirection');
  if (!urlRedirection) return;

  const urlPostConnexion = new URL(urlRedirection, window.location.origin);
  const pageSource = urlPostConnexion.searchParams.get('pageSource');
  if (pageSource) {
    sessionStorage.setItem('pageSource', pageSource);
  }
  if (urlPostConnexion.origin === window.location.origin) {
    sessionStorage.setItem('pagePostConnexion', urlPostConnexion.href);
  }
});
