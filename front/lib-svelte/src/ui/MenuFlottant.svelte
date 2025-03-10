<script lang="ts">
  import FermetureSurClicEnDehors from './FermetureSurClicEnDehors.svelte';

  export let parDessusDeclencheur = false;
  export let fermeMenuSiClicInterne = false;
  export let estLectureSeule = false;
  export let menuOuvert = false;
  export let stopPropagation = false;
  export let classePersonnalisee = '';

  let declencheurEl: HTMLButtonElement;
  let contenuEl: HTMLDivElement;

  const ouvreLeMenu = (e: MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    menuOuvert = true;
  };

  export const fermeLeMenu = () => {
    menuOuvert = false;
  };
</script>

<div class="menu-flottant conteneur {classePersonnalisee}">
  <button
    type="button"
    class="declencheur"
    on:click={ouvreLeMenu}
    bind:this={declencheurEl}
    disabled={estLectureSeule}
  >
    <slot name="declencheur" />
  </button>
  <div
    class="svelte-menu-flottant"
    bind:this={contenuEl}
    class:invisible={!menuOuvert}
    class:parDessusDeclencheur
  >
    <slot />
  </div>
</div>

<FermetureSurClicEnDehors
  bind:doitEtreOuvert={menuOuvert}
  elements={[declencheurEl, ...(fermeMenuSiClicInterne ? [] : [contenuEl])]}
/>
