<script lang="ts">
  import { cubicInOut } from 'svelte/easing';
  import { Tween } from 'svelte/motion';
  import { MediaQuery } from 'svelte/reactivity';

  interface Props {
    actuel: number;
    max: number;
    libelle?: string;
  }

  const { actuel, max, libelle = 'Progression vers le badge Cyberdépart' }: Props = $props();

  const rayon = 29;
  const circonference = 2 * Math.PI * rayon;

  const mouvementRéduit = new MediaQuery('prefers-reduced-motion: reduce');
  const ratio = $derived(max > 0 ? Math.min(Math.max(actuel / max, 0), 1) : 0);
  const estComplet = $derived(ratio >= 1);

  const avancement = new Tween(0, { easing: cubicInOut, duration: 1200 });
  $effect(() => {
    avancement.set(ratio, { duration: mouvementRéduit.current ? 0 : 1200 });
  });
</script>

<div
  class="anneau-progression"
  role="progressbar"
  aria-label={libelle}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-valuenow={Math.min(actuel, max)}
>
  <svg viewBox="18 12 72 72" width="72" height="72" fill="none" aria-hidden="true" focusable="false">
    <rect x="18" y="12" width="72" height="72" rx="36" fill="white" />
    <circle class="piste" cx="54" cy="48" r={rayon} />
    <circle
      class="arc"
      cx="54"
      cy="48"
      r={rayon}
      transform="rotate(-90 54 48)"
      stroke-dasharray={circonference}
      stroke-dashoffset={circonference * (1 - avancement.current)}
    />
    {#if estComplet}
      <path
        class="symbole"
        d="M50.2 55.4 42.8 48l2.1-2.1 5.3 5.3 12.9-12.9 2.1 2.1-15 15Z"
        transform="translate(4.2 -0.4)"
      />
    {:else}
      <path
        class="symbole"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M63.3335 45.3337H64.6668C65.4032 45.3337 66.0001 45.9306 66.0001 46.667V60.0003C66.0001 60.7367 65.4032 61.3337 64.6668 61.3337H43.3335C42.5971 61.3337 42.0001 60.7367 42.0001 60.0003V46.667C42.0001 45.9306 42.5971 45.3337 43.3335 45.3337H44.6668V44.0003C44.6668 40.6658 46.4457 37.5847 49.3335 35.9174C52.2212 34.2502 55.779 34.2502 58.6668 35.9174C61.5545 37.5847 63.3335 40.6658 63.3335 44.0003V45.3337ZM60.6668 45.3337V44.0003C60.6668 40.3184 57.682 37.3337 54.0001 37.3337C50.3182 37.3337 47.3335 40.3184 47.3335 44.0003V45.3337H60.6668ZM52.6668 50.667V56.0003H55.3335V50.667H52.6668Z"
      />
    {/if}
  </svg>
</div>

<style lang="scss">
  .anneau-progression {
    display: block;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    filter: drop-shadow(0 6px 9px rgba(0, 0, 18, 0.16));

    svg {
      display: block;
    }

    .piste,
    .arc {
      fill: none;
      stroke-width: 6;
    }

    .piste {
      stroke: #dddddd;
    }

    .arc {
      stroke: var(--green-emeraude-main-632);
      stroke-linecap: round;
    }

    .symbole {
      fill: var(--background-action-high-blue-france);
    }
  }
</style>
