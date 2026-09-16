<script lang="ts">
  type Props = { numéroÉvènementCourant: number; nombreÉvènementsTotaux: number };
  const { numéroÉvènementCourant, nombreÉvènementsTotaux }: Props = $props();
</script>

<div
  class="progression"
  role="progressbar"
  aria-label="Progression de la simulation"
  aria-valuenow={numéroÉvènementCourant}
  aria-valuemin="1"
  aria-valuemax={nombreÉvènementsTotaux}
>
  {#each Array(nombreÉvènementsTotaux) as _, index (index)}
    <span
      class:active={index < numéroÉvènementCourant}
      aria-hidden="true"
      class:courant={index + 1 === numéroÉvènementCourant}
    ></span>
  {/each}
</div>

<style lang="scss">
  .progression {
    position: sticky;
    z-index: 2;
    top: 0;
    display: flex;
    gap: 0.5rem;
    height: 2.5rem;
    box-sizing: border-box;
    padding-block: 1rem;
    background-color: var(--background-default-grey);

    span {
      height: 0.5rem;
      background-color: var(--background-contrast-grey);
      flex: 1;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--background-action-high-blue-france);
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &.active {
        background-color: var(--background-action-high-blue-france);
      }
      &.courant {
        background-color: var(--background-contrast-grey);
        &:after {
          transform: scaleX(1);
        }
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      transition-duration: 1ms !important;
      transition: none !important;
    }
  }
</style>
