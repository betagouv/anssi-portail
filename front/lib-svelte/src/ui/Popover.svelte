<script module lang="ts">
  import { type Snippet } from 'svelte';

  export type Props = {
    children: Snippet;
    actions?: Snippet;
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { clic } from '../directives/actions.svelte';

  const { children, actions }: Props = $props();
  let encart = $state<HTMLDivElement | undefined>();
  let repliVisible = $state(false);

  onMount(async () => {
    setTimeout(() => {
      if (!encart) {
        return;
      }
      if (typeof encart.showPopover === 'function' && typeof encart.hidePopover === 'function') {
        encart.showPopover();
      } else {
        repliVisible = true;
      }
    }, 500);
  });

  const fermeDialogue = () => {
    repliVisible = false;
    encart?.hidePopover?.();
  };
</script>

<div
  bind:this={encart}
  onclose={fermeDialogue}
  popover="manual"
  class="encart-audessus"
  class:repli-visible={repliVisible}
>
  <div class="conteneur">
    <div class="entete">
      <dsfr-button
        label="Fermer"
        has-icon
        icon-place="right"
        icon="close-line"
        kind="tertiary-no-outline"
        size="sm"
        use:clic={fermeDialogue}
      ></dsfr-button>
    </div>
    <div class="contenu">
      {@render children()}
    </div>
    {#if actions}
      <div class="actions">
        {@render actions()}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille.scss' as *;

  .encart-audessus {
    border: 0;
    box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    gap: 0;
    padding: 0;
    left: anchor(right);
    top: anchor(bottom);
    z-index: 9;

    @include a-partir-de(md) {
      max-width: taille-pour-colonnes(8);
      margin: 1rem;
    }

    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(6);
      margin: 2rem;
    }

    @include a-partir-de(xxl) {
      max-width: taille-pour-colonnes(4);
    }

    &[popover] {
      display: none;
      transition:
        display 0.5s allow-discrete,
        transform 0.5s ease;

      transform: translateX(100%);
    }

    &[popover]:popover-open {
      display: block;
      transform: translateX(0);
    }

    @starting-style {
      &[popover]:popover-open {
        transform: translateX(100%);
      }
    }

    &.repli-visible {
      z-index: calc(var(--ground) + 950);
      display: block;
      position: fixed;
      top: auto;
      left: auto;
      right: 0;
      bottom: 0;
      width: calc(100% - 2rem);
      max-height: calc(100% - 4rem);
      overflow: auto;
      background: white;
      transform: none;
    }

    .conteneur {
      padding: 1rem;

      @include a-partir-de(lg) {
        padding: 1rem 2rem 2rem;
      }

      .entete {
        display: flex;
        flex-direction: row-reverse;
        padding-bottom: 0.5rem;
      }

      .contenu {
        display: flex;
        flex-direction: column;
      }

      .actions {
        display: flex;
        flex-direction: column;
        padding-top: 1rem;
        gap: 1rem;

        :global(*) {
          flex-grow: 1;
        }

        @include a-partir-de(lg) {
          flex-direction: row;
          padding-top: 1.5rem;
        }
      }
    }
  }
</style>
