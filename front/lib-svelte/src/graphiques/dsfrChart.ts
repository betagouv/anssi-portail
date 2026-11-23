import '@gouvfr/dsfr-chart';
import styles from '@gouvfr/dsfr-chart/css?inline';

// Les composants Svelte étant compilés avec leurs styles injectés par le JS, Vite n'émet
// aucune feuille de style que la page chargerait d'elle-même. On injecte donc celle de
// DSFR Chart ici, avec le nonce exigé par la CSP.
const ID_STYLES = 'styles-dsfr-chart';

if (!document.getElementById(ID_STYLES)) {
  const style = document.createElement('style');
  style.id = ID_STYLES;
  const nonce = document.querySelector('meta[property="csp-nonce"]')?.getAttribute('content');
  if (nonce) style.nonce = nonce;
  style.textContent = styles;
  document.head.appendChild(style);
}
