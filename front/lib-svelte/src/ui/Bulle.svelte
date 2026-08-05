<script lang="ts">
  import type { ClassValue } from 'svelte/elements';
  interface Props {
    titre: string;
    description: string;
    class: ClassValue;
  }

  const { titre, description, class: className }: Props = $props();
</script>

<div class={['bulle', className]}>
  <p class="bulle-titre">{titre}</p>
  <p class="bulle-description">{description}</p>
</div>

<style lang="scss">
  @use '../../../assets/styles/grille' as *;

  .bulle {
    background-color: var(--background-default-grey, white);
    border-radius: 0.5rem;
    padding: 0.75rem;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 18, 0.16);

    &-titre,
    &-description {
      margin: 0;
    }

    &-titre {
      font-size: 0.875rem;
      font-weight: 700;
      line-height: normal;
      color: var(--couleur-titre, var(--text-title-grey));
      margin-block-end: var(--marge-titre, 0.25rem);
    }

    &-description {
      font-size: 0.75rem;
      line-height: 1.3125rem;
      color: var(--couleur-description, var(--text-default-grey));
    }
  }
</style>
