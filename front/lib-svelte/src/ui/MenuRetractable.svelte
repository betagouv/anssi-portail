<script lang="ts">
  type Props = {
    children: () => any;
    titre?: string;
  };
  const { children, titre }: Props = $props();
  let details = $state(undefined as HTMLDetailsElement | undefined);
  export function ferme() {
    if (!details) return;
    details.open = false;
  }
</script>

<details bind:this={details}>
  <summary>
    <img class="icon" src="/assets/images/icone-menu-lateral.svg" alt="" />
    <span class="titre">{titre}</span>
    <img class="chevron" src="/assets/images/icone-chevron-bas.svg" alt="" />
  </summary>
  {@render children()}
</details>

<style lang="scss">
  * {
    box-sizing: border-box;
  }

  details {
    position: relative;

    summary {
      align-items: center;
      background-color: #fff;
      border: 1px solid #ddd;
      color: var(--sommaire-actif-couleur);
      cursor: pointer;
      display: flex;
      font-size: 1rem;
      font-style: normal;
      font-weight: 500;
      gap: 8px;
      line-height: 1.5rem;
      padding: 12px 16px;

      .titre {
        flex: 1;
      }

      .chevron {
        transition: transform 0.15s ease-in-out;
        transform: rotate(0deg);
      }
    }

    &:open {
      background-color: white;
      height: 100dvh;
      position: fixed;
      top: 0;
      width: 100%;

      summary {
        background-color: var(--sommaire-mobile-fond);

        .chevron {
          transform: rotate(-180deg);
        }
      }
    }
  }
</style>
