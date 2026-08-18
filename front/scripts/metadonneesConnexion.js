(function () {
  try {
    const paramètresRecherche = new URLSearchParams(window.location.search);
    const campagne = paramètresRecherche.get('mtm_campaign') || paramètresRecherche.get('utm_campaign');
    if (campagne) {
      sessionStorage.setItem('campagne', campagne);
    }
  } catch {}
})();
