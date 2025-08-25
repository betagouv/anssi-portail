<script lang="ts">
  import MenuRetractable from './MenuRetractable.svelte';

  type Props = {
    children?: () => any;
    enteteActive?: HTMLHeadingElement;
    entetes: HTMLHeadingElement[];
    afficheModeReduit: boolean;
  };
  const {
    children,
    enteteActive,
    entetes,
    afficheModeReduit = false,
  }: Props = $props();
  let menu = $state(undefined as MenuRetractable | undefined);
  const recupereTitreEntete = (heading: HTMLHeadingElement | undefined) =>
    heading?.textContent;
  const ferme = () => menu?.ferme();
</script>

<aside class="toc" class:mini={afficheModeReduit}>
  {#if afficheModeReduit}
    <MenuRetractable bind:this={menu} titre={recupereTitreEntete(enteteActive)}>
      <ol>
        {#each entetes as heading}
          <li>
            <a href={`#${heading.id}`} onclick={() => ferme()}
              >{recupereTitreEntete(heading)}</a
            >
          </li>
        {/each}
      </ol>
    </MenuRetractable>
  {:else}
    <ol>
      {#each entetes as heading}
        <li>
          <a href={`#${heading.id}`}>{recupereTitreEntete(heading)}</a>
        </li>
      {/each}
    </ol>
  {/if}
  {@render children?.()}
</aside>

<style lang="scss">
  * {
    box-sizing: border-box;
  }

  aside {
    position: relative;
    user-select: none;
    z-index: 1;

    :global ol {
      background-color: #fff;
      list-style-type: none;
      margin: 0 0 40px;
      padding: 0;

      li {
        a {
          border-left: 2px solid transparent;
          display: inline-block;
          padding: 12px 8px;
          font-size: 1rem;
          font-style: normal;
          font-weight: 700;
          line-height: 1.5rem;
          width: 100%;

          &:hover {
            background: rgba(0, 0, 0, 0.04);
          }
        }

        :global &.actif {
          a {
            border-left-color: #fed980;
          }
        }
      }
    }

    :global &.mini {
      margin: -48px -16px 24px;

      ol {
        padding: 16px;

        li {
          border-bottom: 1px solid #ddd;
          padding-top: 12px;
          padding-bottom: 12px;

          a {
            border-left: 2px solid transparent;
            display: inline-block;
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.5rem;
            padding-left: 14px;
            text-decoration: none;

            &:hover {
              background: none;
            }
          }

          &.actif {
            a {
              color: var(--sommaire-actif-couleur);
              border-left-color: var(--sommaire-actif-indicateur-couleur);
            }
          }
        }
      }
    }
  }
</style>
