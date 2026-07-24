document.addEventListener('DOMContentLoaded', () => {
  sessionStorage.removeItem('pagePostConnexion');

  const urlRedirection = new URL(window.location.href).searchParams.get('urlRedirection');
  if (!urlRedirection) return;

  const urlPostConnexion = new URL(urlRedirection, window.location.origin);
  if (urlPostConnexion.origin === window.location.origin) {
    sessionStorage.setItem('pagePostConnexion', urlPostConnexion.href);
  }
});
