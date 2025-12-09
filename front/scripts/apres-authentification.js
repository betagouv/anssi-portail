document.addEventListener('DOMContentLoaded', () => {
  const pagePostConnexion = sessionStorage.getItem('pagePostConnexion');
  switch (pagePostConnexion) {
    case 'comparaison-maturite':
      window.location = '/ma-maturite#comparaison';
      break;
    default:
      window.location = '/catalogue';
  }
  sessionStorage.removeItem('pagePostConnexion');
});
