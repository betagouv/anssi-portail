<script lang="ts">
  export let href: string;
  export let label: string;
  export let dansMenuDeroulant = false;

  const cheminRelatif = window.location.pathname;
</script>

<a
  {href}
  class:actif={cheminRelatif === href}
  class:dans-menu-deroulant={dansMenuDeroulant}>{label}</a
>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  a {
    padding: 16px 8px;
    font-size: 0.875rem;
    border-bottom: none;

    &:hover {
      background: var(--menu-fond-hover);
    }

    &:active {
      background: var(--menu-fond-clique);
    }

    &.actif {
      font-weight: 500;
      border-bottom: 2px solid var(--jaune-msc);
    }
  }

  .dans-menu-deroulant {
    width: 100%;
    padding: 12px 16px;
    border-bottom: 1px solid #dddddd;
    position: relative;
    font-weight: normal;
    box-sizing: border-box;

    &.actif {
      font-weight: normal;
      border-bottom: 1px solid #dddddd;

      &:before {
        content: '';
        display: block;
        width: 2px;
        height: 24px;
        background: var(--jaune-msc);
        position: absolute;
        left: 0;
      }
    }

    &:last-child {
      border: none;
    }
  }
</style>
