<script lang="ts">
  import { cubicInOut } from 'svelte/easing';
  import { Tween } from 'svelte/motion';

  import { détecteMédia, requêteMédiaMouvementRéduit } from '@utils/rendu.svelte';

  interface Props {
    actuel: number;
    max: number;
    libelle: string;
  }

  const { actuel, max, libelle }: Props = $props();

  const rayon = 45;
  const épaisseur = 10;
  const circonference = 2 * Math.PI * rayon;

  const mouvementRéduit = détecteMédia(requêteMédiaMouvementRéduit);
  const ratio = $derived(max > 0 ? Math.min(Math.max(actuel / max, 0), 1) : 0);

  const avancement = new Tween(0, { easing: cubicInOut, duration: 1200 });
  $effect(() => {
    avancement.set(ratio, { duration: mouvementRéduit.correspond ? 0 : 1200 });
  });

  const estComplet = $derived(avancement.current >= 1);
  const longueurArc = $derived(Math.max(avancement.current * circonference - épaisseur, 0));
</script>

<div
  class="anneau-progression-texte"
  role="progressbar"
  aria-label={libelle}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-valuenow={Math.min(actuel, max)}
  aria-valuetext={`${actuel} sur ${max}`}
>
  <svg viewBox="0 0 100 100" width="100" height="100" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient
        id="degrade-anneau-progression-texte"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="50"
        x2="100"
        y2="50"
      >
        <stop stop-color="#3BEA7E" />
        <stop offset="1" stop-color="#27A658" />
      </linearGradient>
    </defs>
    <circle class="piste" cx="50" cy="50" r={rayon} />
    {#if estComplet}
      <circle class="arc complet" cx="50" cy="50" r={rayon} stroke="url(#degrade-anneau-progression-texte)" />
    {:else if avancement.current > 0}
      <path
        class="arc"
        d="M50 5 a45 45 0 1 1 0 90 a45 45 0 1 1 0 -90"
        stroke="url(#degrade-anneau-progression-texte)"
        stroke-dasharray="{longueurArc} {circonference}"
        stroke-dashoffset={-épaisseur / 2}
      />
    {/if}
  </svg>
  <p class="fr-h5 valeur">{actuel}/{max}</p>
</div>

<style lang="scss">
  .anneau-progression-texte {
    position: relative;
    display: block;
    width: 100px;
    height: 100px;

    svg {
      display: block;
    }

    .piste,
    .arc {
      fill: none;
      stroke-width: 10;
    }

    .piste {
      stroke: #d9d9d9;
    }

    .arc {
      stroke-linecap: round;

      &.complet {
        stroke-linecap: butt;
      }
    }

    .valeur {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      color: var(--text-title-grey);
      white-space: nowrap;
    }
  }
</style>
