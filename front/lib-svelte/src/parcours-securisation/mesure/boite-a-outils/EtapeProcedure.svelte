<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children, titre }: { children: Snippet; titre?: string } = $props();
</script>

<li>
  {#if titre}
    <h3 class="fr-h6">{titre}</h3>
  {/if}
  {@render children()}
</li>

<style lang="scss">
  li {
    counter-increment: item;
    position: relative;

    padding-block: 1.5rem;
    padding-inline-start: var(--largeur-totale);

    &::before {
      content: counter(item);

      position: absolute;
      inset-block-start: 1.5rem;
      inset-inline-start: 0;

      display: grid;
      place-items: center;

      inline-size: var(--largeur-numéro);
      block-size: var(--largeur-numéro);
      border-radius: 50%;

      background-color: var(--background-alt-blue-france);
      color: var(--text-title-blue-france);

      font-size: 1.375rem;
      font-weight: 700;
      text-align: center;
    }

    &:not(:last-child)::after {
      content: '';

      position: absolute;
      inset-block-end: 0;
      inset-inline-start: var(--largeur-totale);
      inset-inline-end: 0;

      block-size: 1px;
      background-color: var(--border-default-grey);
    }

    &:first-child {
      padding-block-start: 0;

      &::before {
        inset-block-start: 0;
      }
    }

    &:last-child {
      padding-block-end: 0;
    }
  }
</style>
