<script lang="ts">
  import { onMount } from 'svelte';
  import {
    type NiveauMaturite,
    niveauxMaturite,
  } from '../niveaux-maturite/NiveauxMaturite.donnees';

  export let niveauCourant: NiveauMaturite;
  export let animeTuiles = true;

  $: indexNiveauCourant = niveauxMaturite.indexOf(niveauCourant);
  onMount(() => {
    let elementCourant: HTMLDivElement | null = document.querySelector(
      '.tuile-niveau.courant'
    );
    elementCourant?.scrollIntoView({ block: 'center' });
  });
</script>

<div class="tuiles-niveau" class:avec-animation={animeTuiles}>
  {#each niveauxMaturite as niveau, index (index)}
    <div
      class="tuile-niveau"
      class:actif={index < indexNiveauCourant}
      class:courant={index === indexNiveauCourant}
      class:inactif={index > indexNiveauCourant}
    >
      <img
        class="plante"
        src="/assets/images/test-maturite/niveaux/{niveau.id}.svg"
        alt="Niveau de maturité"
      />
      <img
        class="coche"
        alt=""
        src="/assets/images/coche-ronde{index > indexNiveauCourant
          ? '-inactive'
          : '-active'}.svg"
      />
      <span>{niveau.label}</span>
    </div>
  {/each}
</div>
