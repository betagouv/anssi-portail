import Lien from './ui/Lien.svelte';

const LienCE = Lien as unknown as { element: CustomElementConstructor };

if (!customElements.get('msc-lien') && LienCE.element) {
  customElements.define('msc-lien', LienCE.element);
}
