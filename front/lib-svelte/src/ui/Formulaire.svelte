<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    id?: string;
    classe?: string;
    formulaireDuTiroir?: boolean;
    surFormulaireValide?: () => void;
    surFormulaireInvalide?: () => void;
    children?: Snippet;
  }

  let {
    id = '',
    classe = '',
    formulaireDuTiroir = false,
    surFormulaireValide,
    surFormulaireInvalide,
    children,
  }: Props = $props();

  let formulaire: HTMLFormElement | undefined = $state();

  const trouveLibellePour = (element: Element) => {
    for (const libelle of document.getElementsByTagName('label')) {
      if (libelle.htmlFor === element.id) return libelle;
    }
  };

  export const estValide = () => {
    if (!formulaire) return false;

    const valide = formulaire.checkValidity();
    const champAvecErreur = formulaire.querySelectorAll('input:invalid, select:invalid');
    if (champAvecErreur.length) {
      let element = champAvecErreur[0];
      const libelle = trouveLibellePour(element);
      if (libelle) element = libelle;
      element.scrollIntoView({ behavior: 'smooth' });
    }
    return valide;
  };

  const verifieValidite = () => {
    if (!formulaire) return;
    formulaire.checkValidity() ? surFormulaireValide?.() : surFormulaireInvalide?.();
  };

  const soumets = (evenement: SubmitEvent) => {
    evenement.preventDefault();
    verifieValidite();
  };
</script>

<form bind:this={formulaire} onsubmit={soumets} {id} novalidate class={classe} class:formulaireDuTiroir>
  {@render children?.()}
</form>

<style lang="scss">
  .formulaireDuTiroir {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
