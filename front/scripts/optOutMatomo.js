const elementConsentement = () =>
  document.getElementById('consentement-matomo');

const modifieLabelConsentement = () => {
  const optOutMatomo = localStorage.getItem('optOutMatomo') === 'true';
  document.getElementById('label-consentement-matomo').innerHTML = optOutMatomo
    ? 'Vous n’êtes actuellement pas suivi(e). Cochez cette case pour ne plus être exclu(e).'
    : 'Vous êtes suivi(e) de manière anonyme. Décochez cette case pour vous exclure du suivi.';
};

const chargeEtatInitial = () => {
  const optOutMatomo = localStorage.getItem('optOutMatomo') === 'true';
  elementConsentement().checked = !optOutMatomo;
  modifieLabelConsentement();
};

window.addEventListener('DOMContentLoaded', chargeEtatInitial);

elementConsentement().addEventListener('change', () => {
  const optOutMatomo = !elementConsentement().checked;
  localStorage.setItem('optOutMatomo', optOutMatomo);
  modifieLabelConsentement();
});
